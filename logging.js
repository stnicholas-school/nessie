/**
 * Nessie — Standardised logging
 * Format: [NESSIE] Starting process -> Step 1/3 – Action -> [SUCCESS] Done.
 * Never pass secrets (API keys) to these functions.
 */

const NessieLog = Object.freeze({
  start: function (process) {
    console.log('[NESSIE] Starting ' + process);
  },
  step: function (index, total, action) {
    console.log('[NESSIE] Step ' + index + '/' + total + ' – ' + action);
  },
  warn: function (message, context) {
    console.warn('[NESSIE] [WARNING] ' + message + (context ? ' | context: ' + context : ''));
  },
  error: function (cause, context, action) {
    console.error('[NESSIE] [ERROR] cause: ' + cause + ' | context: ' + context + ' | action: ' + action);
  },
  success: function (process) {
    console.log('[NESSIE] [SUCCESS] ' + process);
  }
});

/**
 * Builds an Error whose message carries a machine-readable code so the
 * client can react to it (e.g. show the onboarding banner on API_KEY_MISSING).
 * Message format: "[CODE] Localised human text"
 */
function nessieError_(code, locale, params) {
  return new Error('[' + code + '] ' + i18n(locale, 'ERR_' + code, params));
}
