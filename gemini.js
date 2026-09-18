/**
 * Nessie — Gemini AI service
 * ---------------------------------------------------------------------------
 * - The API key travels in the x-goog-api-key header (never in the URL/logs).
 * - Models are discovered automatically, ranked (newest stable Flash first),
 *   and the last model that worked is cached per user for 6 hours.
 * - Auth errors stop immediately; quota/404/5xx errors fall through to the
 *   next candidate model.
 */

/**
 * @param {string} sourceText    text to adapt
 * @param {string} actionType    one of AI_ACTIONS
 * @param {boolean} includeGlossary
 * @param {string} customPrompt  optional teacher instruction
 * @param {?string} langCode     'pt' | 'en' | 'es', or null when detection found no signal
 * @param {string} locale        UI locale, used for error messages
 * @returns {{adaptedText:string, glossary:string, model:string}}
 */
function callGemini(sourceText, actionType, includeGlossary, customPrompt, langCode, locale) {
  NessieLog.start('callGemini (' + actionType + ')');

  const apiKey = getApiKey_();
  if (!apiKey) {
    NessieLog.error('API key missing', 'callGemini', 'Asked user to configure Settings');
    throw nessieError_('API_KEY_MISSING', locale);
  }

  NessieLog.step(1, 3, 'Build request');
  const payload = {
    contents: [{ role: 'user', parts: [{ text: 'Source text to adapt:\n\n' + sourceText }] }],
    systemInstruction: { parts: [{ text: buildSystemInstruction_(actionType, includeGlossary, customPrompt, langCode) }] },
    generationConfig: {
      temperature: GEMINI_CONFIG.TEMPERATURE,
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'OBJECT',
        properties: {
          adaptedText: { type: 'STRING' },
          glossary: { type: 'STRING' }
        },
        required: ['adaptedText', 'glossary']
      }
    }
  };

  NessieLog.step(2, 3, 'Resolve models');
  const candidates = resolveModelCandidates_(apiKey, locale);
  const failures = [];
  let quotaHit = false;

  NessieLog.step(3, 3, 'Call models');
  for (let i = 0; i < candidates.length; i++) {
    const model = candidates[i];
    let response;
    try {
      response = geminiFetch_('/models/' + model + ':generateContent', 'post', apiKey, payload);
    } catch (netErr) {
      failures.push(model + ': ' + netErr.message);
      NessieLog.warn('Network failure', model);
      continue;
    }

    const status = response.getResponseCode();
    const body = response.getContentText();

    if (status === 200) {
      const parsed = parseGeminiResponse_(body);
      if (parsed.error) {
        failures.push(model + ': ' + parsed.error);
        NessieLog.warn('Unusable response', model + ' – ' + parsed.error);
        continue;
      }
      cacheWorkingModel_(model);
      NessieLog.success('callGemini via ' + model);
      return { adaptedText: parsed.adaptedText, glossary: parsed.glossary, model: model };
    }

    if (status === 401 || status === 403 || (status === 400 && /API[_ ]KEY/i.test(body))) {
      NessieLog.error('HTTP ' + status + ' (authentication)', model, 'Stopped; user must fix the key');
      throw nessieError_('API_KEY_INVALID', locale);
    }

    if (status === 429) quotaHit = true;
    failures.push(model + ': HTTP ' + status + ' ' + summariseApiError_(body));
    NessieLog.warn('HTTP ' + status, model);
  }

  clearModelCache_();
  if (quotaHit && failures.length === candidates.length) {
    NessieLog.error('Quota exhausted on all candidates', 'callGemini', 'Asked user to retry later');
    throw nessieError_('QUOTA', locale);
  }
  NessieLog.error('All candidate models failed', failures.join(' | '), 'Returned error to user');
  throw nessieError_('AI_FAILED', locale, { details: failures.join(' | ') });
}

function buildSystemInstruction_(actionType, includeGlossary, customPrompt, langCode) {
  // When local detection has no signal (e.g. a 3-word fragment) the language is
  // NOT guessed from the UI locale: the model is told to mirror the source text.
  const languageName = LOCALES.PROMPT_NAMES[langCode] || null;
  const target = languageName || 'the same language as the source text';

  const opening =
    'ABSOLUTE LANGUAGE REQUIREMENT (read this first): ' +
    (languageName ? 'the source text is written in ' + languageName + '. ' : 'identify the language of the source text. ') +
    "You MUST write both the 'adaptedText' and the 'glossary' fields entirely in " + target + '. ' +
    'Do NOT translate into English or any other language. This applies no matter which task mode, CEFR level or formatting ' +
    "instruction follows; CEFR levels describe complexity targets only, they do NOT mean 'write in English'.";

  const closing =
    "FINAL REMINDER: write 'adaptedText' and 'glossary' entirely in " + target + '. ' +
    'If you were about to answer in another language, rewrite your answer in ' + target + ' instead.';

  const parts = [
    opening,
    AI_CONFIG.SYSTEM_IDENTITY,
    AI_CONFIG.CORE_RULES,
    'SPECIFIC TASK MODE DIRECTIVE:\n' + AI_CONFIG.MODES[actionType]
  ];

  if (customPrompt) {
    parts.push('ADDITIONAL TEACHER INSTRUCTION (follow it unless it contradicts the language requirement or the output format):\n' + customPrompt);
  }

  parts.push(includeGlossary
    ? "GLOSSARY: identify the key academic terms and fill the 'glossary' field (one 'term: definition' per line)."
    : "GLOSSARY: not requested. Return the 'glossary' field as an empty string.");

  parts.push(closing);
  return parts.join('\n\n');
}

function parseGeminiResponse_(body) {
  let data;
  try {
    data = JSON.parse(body);
  } catch (err) {
    return { error: 'invalid JSON envelope' };
  }

  const candidate = data.candidates && data.candidates[0];
  if (!candidate) {
    const blockReason = data.promptFeedback && data.promptFeedback.blockReason;
    return { error: 'no candidates' + (blockReason ? ' (blockReason: ' + blockReason + ')' : '') };
  }

  const parts = (candidate.content && candidate.content.parts) || [];
  const rawText = parts
    .filter(function (p) { return p && typeof p.text === 'string' && !p.thought; })
    .map(function (p) { return p.text; })
    .join('')
    .trim();

  if (!rawText) {
    return { error: 'empty content (finishReason: ' + (candidate.finishReason || 'UNKNOWN') + ')' };
  }

  let output;
  try {
    output = JSON.parse(rawText.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, ''));
  } catch (err) {
    return { error: 'structured output was not valid JSON' };
  }

  const adaptedText = String(output.adaptedText || '').trim();
  if (!adaptedText) return { error: "empty 'adaptedText'" };

  return { adaptedText: adaptedText, glossary: String(output.glossary || '').trim() };
}

// ─── Model discovery ──────────────────────────────────────────────────────────

/**
 * Ordered list of models to try: override → cached → discovered → fallback.
 * Throws immediately if the API rejects the key during discovery.
 */
function resolveModelCandidates_(apiKey, locale) {
  if (GEMINI_CONFIG.MODEL_OVERRIDE) return [GEMINI_CONFIG.MODEL_OVERRIDE];

  const ordered = [];
  const push = function (name) {
    const clean = String(name || '').replace(/^models\//, '');
    if (clean && ordered.indexOf(clean) === -1) ordered.push(clean);
  };

  try {
    push(CacheService.getUserCache().get(GEMINI_CONFIG.MODEL_CACHE_KEY));
  } catch (err) {
    NessieLog.warn('Model cache unavailable', err.message);
  }

  const listing = listGenerativeModels_(apiKey);
  if (listing.ok) {
    rankModels_(listing.models).forEach(push);
  } else if (listing.status === 400 || listing.status === 401 || listing.status === 403) {
    throw classifyHttpError_(listing.status, listing.body, locale);
  } else {
    NessieLog.warn('Model discovery failed, using fallback list', 'HTTP ' + listing.status);
  }

  GEMINI_CONFIG.FALLBACK_MODELS.forEach(push);
  return ordered.slice(0, GEMINI_CONFIG.MAX_MODEL_ATTEMPTS);
}

/** @returns {{ok:boolean, status:number, body:string, models:string[]}} */
function listGenerativeModels_(apiKey) {
  try {
    const response = geminiFetch_('/models?pageSize=1000', 'get', apiKey);
    const status = response.getResponseCode();
    const body = response.getContentText();
    if (status !== 200) return { ok: false, status: status, body: body, models: [] };

    const data = JSON.parse(body);
    const models = (data.models || [])
      .filter(function (m) {
        return m.supportedGenerationMethods && m.supportedGenerationMethods.indexOf('generateContent') !== -1;
      })
      .map(function (m) { return String(m.name).replace(/^models\//, ''); });

    return { ok: true, status: status, body: '', models: models };
  } catch (err) {
    return { ok: false, status: 0, body: err.message, models: [] };
  }
}

/**
 * Keeps text-capable Gemini models and sorts them:
 * stable before preview → Flash before Flash-Lite before Pro → newest version first.
 */
function rankModels_(names) {
  const scored = names
    .filter(function (name) {
      return /^gemini-/.test(name) && !GEMINI_CONFIG.EXCLUDED_MODEL_PATTERN.test(name);
    })
    .map(function (name) {
      const versionMatch = name.match(/^gemini-(\d+(?:\.\d+)?)/);
      const version = versionMatch ? parseFloat(versionMatch[1]) : 0;
      const isStable = version > 0 && !/(preview|latest|\d{2}-\d{4})/i.test(name);
      let family = 0;
      if (/-flash-lite/.test(name)) family = 2;
      else if (/-flash/.test(name)) family = 3;
      else if (/-pro/.test(name)) family = 1;
      return { name: name, stable: isStable ? 1 : 0, family: family, version: version };
    })
    .filter(function (m) { return m.family > 0; });

  scored.sort(function (a, b) {
    return (b.stable - a.stable) || (b.family - a.family) || (b.version - a.version) || a.name.localeCompare(b.name);
  });

  return scored.map(function (m) { return m.name; });
}

function cacheWorkingModel_(model) {
  try {
    CacheService.getUserCache().put(GEMINI_CONFIG.MODEL_CACHE_KEY, model, GEMINI_CONFIG.MODEL_CACHE_SECONDS);
  } catch (err) {
    NessieLog.warn('Could not cache working model', err.message);
  }
}

// ─── HTTP helpers ─────────────────────────────────────────────────────────────

function geminiFetch_(path, method, apiKey, payload) {
  const options = {
    method: method,
    headers: { 'x-goog-api-key': apiKey },
    muteHttpExceptions: true
  };
  if (payload) {
    options.contentType = 'application/json';
    options.payload = JSON.stringify(payload);
  }
  return UrlFetchApp.fetch(GEMINI_CONFIG.API_BASE + path, options);
}

function classifyHttpError_(status, body, locale) {
  if (status === 401 || status === 403 || (status === 400 && /API[_ ]KEY/i.test(body))) {
    return nessieError_('API_KEY_INVALID', locale);
  }
  if (status === 429) return nessieError_('QUOTA', locale);
  if (status === 0) return nessieError_('NETWORK', locale, { details: body });
  return nessieError_('AI_FAILED', locale, { details: 'HTTP ' + status + ' ' + summariseApiError_(body) });
}

function summariseApiError_(body) {
  try {
    const data = JSON.parse(body);
    if (data.error && data.error.message) return String(data.error.message).slice(0, 200);
  } catch (err) {
    // body was not JSON
  }
  return String(body || '').slice(0, 200);
}

// ─── Language detection ───────────────────────────────────────────────────────

/**
 * Lightweight local guess (pt | es | en | null). Not a general detector: it
 * only needs to name the language explicitly in the prompt so the model does
 * not drift into English because of the CEFR association.
 */
function guessTextLanguage(text) {
  if (!text || !text.trim()) return null;
  const sample = text.toLowerCase().slice(0, 4000);

  // 1. Near-exclusive character signals.
  const ptChars = (sample.match(/[ãõ]|ç[aãoõu]|ções|ção|você/g) || []).length;
  const esChars = (sample.match(/[ñ¿¡]|ción\b|usted/g) || []).length;
  if (ptChars > 0 && ptChars >= esChars) return 'pt';
  if (esChars > 0) return 'es';

  // 2. Function-word counting.
  const markers = {
    pt: [' não ', ' uma ', ' com ', ' são ', ' você ', ' isso ', ' também ', ' já ', ' pelo ', ' pela ', ' seu ', ' sua ', ' mais ', ' dos ', ' das ', ' pelos ', ' nas ', ' nos ', ' ao ', ' às ', ' do ', ' da ', ' em ', ' e ', ' um ', ' é ', ' os ', ' ou '],
    es: [' una ', ' con ', ' son ', ' usted ', ' eso ', ' también ', ' ya ', ' pero ', ' más ', ' así ', ' su ', ' del ', ' los ', ' las ', ' el ', ' en ', ' y '],
    en: [' the ', ' and ', ' is ', ' are ', ' that ', ' with ', ' this ', ' for ', ' you ', ' was ', ' have ', ' not ', ' but ', ' they ', ' which ', ' of ', ' to ']
  };

  const padded = ' ' + sample.replace(/[.,;:!?()"'«»\n\r\t]/g, ' ') + ' ';
  const scores = { pt: 0, es: 0, en: 0 };

  Object.keys(markers).forEach(function (lang) {
    markers[lang].forEach(function (token) {
      let idx = 0;
      while ((idx = padded.indexOf(token, idx)) !== -1) {
        scores[lang]++;
        idx += token.length - 1;
      }
    });
  });

  const total = scores.pt + scores.es + scores.en;
  if (total === 0) return null;

  return Object.keys(scores).reduce(function (a, b) { return scores[a] >= scores[b] ? a : b; });
}
