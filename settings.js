/**
 * Nessie — Per-user settings service
 * ---------------------------------------------------------------------------
 * Storage: UserProperties (private to each Google account, per script project).
 * Why not ScriptProperties: they are visible to every editor and are copied
 * together with the document, so a template would leak its owner's API key.
 */

function getLocale_() {
  try {
    const value = PropertiesService.getUserProperties().getProperty(PROP_KEYS.LOCALE);
    return LOCALES.SUPPORTED.indexOf(value) !== -1 ? value : LOCALES.DEFAULT;
  } catch (err) {
    // onOpen may run in a restricted auth mode where properties are unavailable.
    return LOCALES.DEFAULT;
  }
}

function maskApiKey_(apiKey) {
  return apiKey ? '••••••••' + apiKey.slice(-4) : '';
}

function isPlausibleApiKey_(apiKey) {
  return /^[A-Za-z0-9._\-]{30,128}$/.test(apiKey);
}

/**
 * Called by Settings.html and Index.html.
 * @returns {{hasApiKey:boolean, apiKeyMasked:string, locale:string, apiKeyUrl:string, version:string}}
 */

/** Chave pessoal do professor (UserProperties). */
function getPersonalApiKey_() {
  const value = PropertiesService.getUserProperties().getProperty(PROP_KEYS.API_KEY);
  return value ? value.trim() : '';
}

/** Chave institucional (ScriptProperties), só na instância interna. */
function getSharedApiKey_() {
  if (!APP_CONFIG.SHARED_KEY_ENABLED) return '';
  try {
    const value = PropertiesService.getScriptProperties().getProperty(PROP_KEYS.SHARED_API_KEY);
    return value ? value.trim() : '';
  } catch (err) {
    NessieLog.warn('Shared key unavailable', err.message);
    return '';
  }
}

/** Chave efetiva: a pessoal tem prioridade sobre a da escola. */
function getApiKey_() {
  return getPersonalApiKey_() || getSharedApiKey_();
}

/** 'user' | 'shared' | 'none' */
function getKeySource_() {
  if (getPersonalApiKey_()) return 'user';
  if (getSharedApiKey_()) return 'shared';
  return 'none';
}

function getSettings() {
  const personalKey = getPersonalApiKey_();
  return {
    hasApiKey: !!getApiKey_(),
    hasPersonalKey: !!personalKey,
    keySource: getKeySource_(),
    apiKeyMasked: maskApiKey_(personalKey),
    locale: getLocale_(),
    apiKeyUrl: GEMINI_CONFIG.API_KEY_URL,
    version: APP_CONFIG.VERSION
  };
}

/**
 * Persists user settings. Any omitted/blank field is left unchanged.
 * @param {{apiKey?:string, locale?:string}} payload
 * @returns {Object} fresh getSettings() snapshot
 */
function saveSettings(payload) {
  NessieLog.start('saveSettings');
  const data = payload || {};
  const props = PropertiesService.getUserProperties();
  const locale = String(data.locale || '').trim();
  const apiKey = String(data.apiKey || '').trim();

  NessieLog.step(1, 3, 'Validate and save locale');
  if (locale) {
    if (LOCALES.SUPPORTED.indexOf(locale) === -1) {
      NessieLog.error('Unsupported locale', 'saveSettings', 'Rejected request');
      throw nessieError_('LOCALE', getLocale_(), { locale: locale });
    }
    props.setProperty(PROP_KEYS.LOCALE, locale);
  }

  NessieLog.step(2, 3, 'Validate and save API key');
  if (apiKey && apiKey.charAt(0) !== '•') {
    if (!isPlausibleApiKey_(apiKey)) {
      NessieLog.error('API key failed format validation', 'saveSettings', 'Rejected request');
      throw nessieError_('API_KEY_FORMAT', getLocale_());
    }
    props.setProperty(PROP_KEYS.API_KEY, apiKey);
    clearModelCache_();
  }

  NessieLog.step(3, 3, 'Purge legacy script properties');
  purgeLegacyScriptProperties_();

  NessieLog.success('saveSettings');
  return getSettings();
}

/** Removes the current user's API key. */
function clearApiKey() {
  NessieLog.start('clearApiKey');
  PropertiesService.getUserProperties().deleteProperty(PROP_KEYS.API_KEY);
  clearModelCache_();
  NessieLog.success('clearApiKey');
  return getSettings();
}

/**
 * Verifies a key against the Gemini API.
 * @param {string=} candidateKey key typed in the dialog; blank = use the saved key
 * @returns {{ok:boolean, message:string, model:string}}
 */
function testApiKey(candidateKey) {
  NessieLog.start('testApiKey');
  const locale = getLocale_();
  const typed = String(candidateKey || '').trim();
  const apiKey = (typed && typed.charAt(0) !== '•') ? typed : getApiKey_();

  if (!apiKey) {
    return { ok: false, message: i18n(locale, 'ERR_API_KEY_MISSING'), model: '' };
  }
  if (!isPlausibleApiKey_(apiKey)) {
    return { ok: false, message: i18n(locale, 'ERR_API_KEY_FORMAT'), model: '' };
  }

  try {
    const listing = listGenerativeModels_(apiKey);
    if (!listing.ok) throw classifyHttpError_(listing.status, listing.body, locale);

    const ranked = rankModels_(listing.models);
    const model = GEMINI_CONFIG.MODEL_OVERRIDE || ranked[0] || GEMINI_CONFIG.FALLBACK_MODELS[0];
    NessieLog.success('testApiKey');
    return { ok: true, message: i18n(locale, 'TEST_OK', { model: model }), model: model };
  } catch (err) {
    NessieLog.warn('API key test failed', err.message);
    return { ok: false, message: stripErrorCode_(err.message), model: '' };
  }
}

function purgeLegacyScriptProperties_() {
  try {
    const scriptProps = PropertiesService.getScriptProperties();
    LEGACY_SCRIPT_PROP_KEYS.forEach(function (key) {
      if (key === PROP_KEYS.SHARED_API_KEY) return;
      if (scriptProps.getProperty(key) !== null) {
        scriptProps.deleteProperty(key);
        NessieLog.warn('Removed legacy script property', key);
      }
    });
  } catch (err) {
    NessieLog.warn('Could not purge legacy script properties', err.message);
  }
}

function clearModelCache_() {
  try {
    CacheService.getUserCache().remove(GEMINI_CONFIG.MODEL_CACHE_KEY);
  } catch (err) {
    NessieLog.warn('Could not clear model cache', err.message);
  }
}

function stripErrorCode_(message) {
  return String(message || '').replace(/^\[[A-Z_]+\]\s*/, '');
}
