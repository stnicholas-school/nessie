/**
 * Nessie — Controller
 * ---------------------------------------------------------------------------
 * Menu, UI rendering and the adaptation dispatcher.
 * No spreadsheet dependency: all configuration lives in code (config.js,
 * prompts.js, commands.js) and per-user settings (settings.js).
 */

function onOpen(e) {
  try {
    const locale = getLocale_();
    DocumentApp.getUi()
      .createMenu(APP_CONFIG.APP_NAME)
      .addItem(i18n(locale, 'MENU_OPEN_SIDEBAR'), 'showSidebar')
      .addItem(i18n(locale, 'MENU_SETTINGS'), 'showSettingsDialog')
      .addSeparator()
      .addItem(i18n(locale, 'MENU_TEST_API'), 'debugApiKey')
      .addItem(i18n(locale, 'MENU_ABOUT'), 'showAbout')
      .addToUi();
  } catch (err) {
    NessieLog.error(err.message, 'onOpen', 'Menu not rendered; reload the document');
  }
}

function onInstall(e) {
  onOpen(e);
}

// ─── UI rendering ─────────────────────────────────────────────────────────────

function buildBootJson_() {
  const settings = getSettings();
  const boot = {
    locale: settings.locale,
    defaultLocale: LOCALES.DEFAULT,
    supportedLocales: LOCALES.SUPPORTED,
    ttsPrefixes: LOCALES.TTS_PREFIXES,
    hasApiKey: settings.hasApiKey,
    apiKeyMasked: settings.apiKeyMasked,
    apiKeyUrl: settings.apiKeyUrl,
    version: settings.version,
    i18n: I18N_DICT
  };
  // Escape "<" so the JSON can never close the surrounding <script> tag.
  return JSON.stringify(boot).replace(/</g, '\\u003c');
}

function showSidebar() {
  NessieLog.start('showSidebar');
  const template = HtmlService.createTemplateFromFile('Index');
  template.APP_NAME = APP_CONFIG.APP_NAME;
  template.LOGO_URL = APP_CONFIG.LOGO_URL;
  template.PRIMARY_COLOR = APP_CONFIG.PRIMARY_COLOR;
  template.SECONDARY_COLOR = APP_CONFIG.SECONDARY_COLOR;
  template.BOOT_JSON = buildBootJson_();

  const output = template.evaluate().setTitle(APP_CONFIG.APP_NAME);
  DocumentApp.getUi().showSidebar(output);
  NessieLog.success('showSidebar');
}

function showSettingsDialog() {
  NessieLog.start('showSettingsDialog');
  const locale = getLocale_();
  const template = HtmlService.createTemplateFromFile('Settings');
  template.PRIMARY_COLOR = APP_CONFIG.PRIMARY_COLOR;
  template.BOOT_JSON = buildBootJson_();

  const output = template.evaluate().setWidth(440).setHeight(470);
  DocumentApp.getUi().showModalDialog(output, APP_CONFIG.APP_NAME + ' — ' + i18n(locale, 'SETTINGS_DIALOG_TITLE'));
  NessieLog.success('showSettingsDialog');
}

function showAbout() {
  const locale = getLocale_();
  const ui = DocumentApp.getUi();
  ui.alert(
    APP_CONFIG.APP_NAME,
    i18n(locale, 'ABOUT_BODY', {
      version: APP_CONFIG.VERSION,
      org: APP_CONFIG.ORG_NAME,
      dev: APP_CONFIG.CREDITS_DEV,
      ped: APP_CONFIG.CREDITS_PEDAGOGICAL
    }) + (APP_CONFIG.REPO_URL ? '\n\n' + APP_CONFIG.REPO_URL : ''),
    ui.ButtonSet.OK
  );
}

function debugApiKey() {
  const result = testApiKey('');
  DocumentApp.getUi().alert((result.ok ? '✅ ' : '❌ ') + result.message);
}

// ─── TTS ──────────────────────────────────────────────────────────────────────

function getSelectedTextForTTS() {
  try {
    return collectSelection_(DocumentApp.getActiveDocument())
      .map(function (segment) { return segment.text; })
      .join(' ');
  } catch (err) {
    NessieLog.error(err.message, 'getSelectedTextForTTS', 'Returned empty text');
    return '';
  }
}

// ─── Adaptation dispatcher ────────────────────────────────────────────────────

/**
 * Entry point for every sidebar action.
 * @param {string} actionType       one of AI_ACTIONS or LOCAL_ACTIONS
 * @param {boolean} includeGlossary
 * @param {string} customPromptModifier
 * @returns {{ok:boolean, model:string}}
 */
function processAdaptation(actionType, includeGlossary, customPromptModifier) {
  const locale = getLocale_();
  NessieLog.start('processAdaptation (' + actionType + ')');

  try {
    const isAi = AI_ACTIONS.indexOf(actionType) !== -1;
    const isLocal = LOCAL_ACTIONS.indexOf(actionType) !== -1;
    if (!isAi && !isLocal) throw nessieError_('UNKNOWN_ACTION', locale, { action: actionType });

    NessieLog.step(1, 3, 'Read selection');
    const doc = DocumentApp.getActiveDocument();
    const segments = collectSelection_(doc);
    if (!segments.length) throw nessieError_('NO_SELECTION', locale);

    const fullText = segments.map(function (s) { return s.text; }).join('\n');
    const detectedLang = guessTextLanguage(fullText);
    const langCode = detectedLang || locale; // used for document labels and command terms

    if (isLocal) {
      NessieLog.step(2, 3, 'Apply local formatting');
      runLocalAction_(doc, segments, actionType, langCode);
      NessieLog.step(3, 3, 'Local formatting applied');
      NessieLog.success('processAdaptation (' + actionType + ')');
      return { ok: true, model: '' };
    }

    if (fullText.length > GEMINI_CONFIG.MAX_INPUT_CHARS) {
      throw nessieError_('TEXT_TOO_LONG', locale, { count: fullText.length, max: GEMINI_CONFIG.MAX_INPUT_CHARS });
    }

    NessieLog.step(2, 3, 'Request AI adaptation (detected lang: ' + (detectedLang || 'none') + ')');
    const customPrompt = String(customPromptModifier || '').trim().slice(0, 1000);
    const ai = callGemini(fullText, actionType, !!includeGlossary, customPrompt, detectedLang, locale);

    NessieLog.step(3, 3, 'Write result to document');
    const body = doc.getBody();
    const lastIndex = getTopLevelIndex_(body, segments[segments.length - 1].element);
    const insertIndex = lastIndex === -1 ? body.getNumChildren() : lastIndex + 1;

    segments.forEach(markOriginal_);
    insertAdaptedContent_(body, insertIndex, {
      header: i18n(langCode, 'DOC_ADAPTED', { mode: i18n(langCode, ACTION_LABEL_KEYS[actionType]) }),
      text: ai.adaptedText,
      glossary: includeGlossary ? ai.glossary : '',
      glossaryTitle: i18n(langCode, 'DOC_GLOSSARY')
    });

    NessieLog.success('processAdaptation (' + actionType + ') via ' + ai.model);
    return { ok: true, model: ai.model };

  } catch (err) {
    if (/^\[[A-Z_]+\]/.test(err.message)) throw err;
    NessieLog.error(err.message, 'processAdaptation (' + actionType + ')', 'Returned generic error to user');
    throw nessieError_('GENERIC', locale, { details: err.message });
  }
}

function runLocalAction_(doc, segments, actionType, langCode) {
  const foundTerms = [];

  segments.forEach(function (segment) {
    switch (actionType) {
      case 'PUNCTUATION':
        highlightPunctuation(segment.textEl, segment.start, segment.end);
        break;
      case 'ADHD':
      case 'DYSLEXIA':
        applyPedagogicalFormatting(segment.textEl, segment.start, segment.end, actionType, segment.element);
        break;
      case 'HIGHLIGHT_COMMANDS':
        highlightCommands(segment.textEl, segment.start, segment.end, langCode).forEach(function (entry) {
          if (foundTerms.indexOf(entry) === -1) foundTerms.push(entry);
        });
        break;
    }
  });

  if (actionType === 'HIGHLIGHT_COMMANDS' && foundTerms.length) {
    appendCommandsGlossary_(doc, foundTerms, langCode);
  }
}


// ─── Chave institucional (apenas na instância interna) ────────────────────────

/**
 * Diagnóstico da chave da escola. Rode pelo editor do Apps Script,
 * ou adicione ao menu se quiser deixar disponível para a equipe de TI.
 */
function checkSharedApiKey() {
  const enabled = APP_CONFIG.SHARED_KEY_ENABLED;
  const shared = getSharedApiKey_();
  const lines = [
    'SHARED_KEY_ENABLED: ' + enabled,
    'Script property ' + PROP_KEYS.SHARED_API_KEY + ': ' + (shared ? maskApiKey_(shared) : '(vazia)'),
    'Fonte em uso para este usuário: ' + getKeySource_()
  ];

  if (enabled && shared) {
    const result = testApiKey('');
    lines.push('Teste de conexão: ' + (result.ok ? 'OK' : 'FALHOU'));
    lines.push(result.message);
  }

  const report = lines.join('\n');
  console.log(report);
  try { DocumentApp.getUi().alert(APP_CONFIG.APP_NAME, report, DocumentApp.getUi().ButtonSet.OK); } catch (err) {}
  return report;
}

/**
 * Remove a chave da escola das Script Properties.
 * Útil antes de exportar este projeto para a versão pública.
 */
function clearSharedApiKey() {
  PropertiesService.getScriptProperties().deleteProperty(PROP_KEYS.SHARED_API_KEY);
  NessieLog.success('clearSharedApiKey');
  return 'Chave institucional removida.';
}