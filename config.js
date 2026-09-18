/**
 * Nessie — Static configuration
 * ---------------------------------------------------------------------------
 * Everything the add-on needs to run lives in code. There is NO spreadsheet
 * dependency. The only runtime settings (Gemini API key and interface
 * language) are entered by each user through the Settings dialog and stored
 * in that user's UserProperties.
 *
 * To rebrand a fork, edit APP_CONFIG below. To change AI behaviour, edit
 * prompts.js. To change command-term definitions, edit commands.js.
 */

const APP_CONFIG = Object.freeze({
  APP_NAME: 'Nessie',
  VERSION: '2.2.1',
  PATCH:'30',

  // ── Origem e direitos de uso ───────────────────────────────────────────────
  LICENSE: 'MIT',
  LICENSE_URL: 'https://opensource.org/license/mit',
  COPYRIGHT: '© 2026 St. Nicholas School',
  REPO_URL: 'https://github.com/stnicholas-school/nessie.git',
  ORIGIN: 'Made by EdTech St. Nicholas School, ' +
          'São Paulo, Brasil, e and published as open source software.',
  AI_PROVIDER: 'Google Gemini API',
  AI_TERMS_URL: 'https://ai.google.dev/gemini-api/terms',

  ORG_NAME: 'St. Nicholas School',
  CREDITS_DEV: 'Victor Menna',
  CREDITS_PEDAGOGICAL: 'Ms Contin, Ms Geraldini and Ms Nobre',

  // true APENAS na instância interna publicada como add-on.
  SHARED_KEY_ENABLED: false,

  // ── Identidade visual ──────────────────────────────────────────────────────
  LOGO_URL: '',
  PRIMARY_COLOR: '#1a73e8',
  SECONDARY_COLOR: '#34a853',
  ORIGINAL_TEXT_COLOR: '#d93025',
  ADAPTED_TEXT_COLOR: '#1f2937',
  GLOSSARY_TEXT_COLOR: '#6b7280'
});

const LOCALES = Object.freeze({
  DEFAULT: 'pt',
  SUPPORTED: Object.freeze(['pt', 'en', 'es']),
  // Names used inside AI prompts (kept in English on purpose: model-facing).
  PROMPT_NAMES: Object.freeze({ pt: 'Portuguese', en: 'English', es: 'Spanish' }),
  // BCP-47 prefixes used by the sidebar to rank text-to-speech voices.
  TTS_PREFIXES: Object.freeze({ pt: ['pt-BR', 'pt'], en: ['en-GB', 'en'], es: ['es-ES', 'es-MX', 'es'] })
});

const GEMINI_CONFIG = Object.freeze({
  API_BASE: 'https://generativelanguage.googleapis.com/v1beta',
  API_KEY_URL: 'https://aistudio.google.com/apikey',

  // Force a specific model (e.g. 'gemini-2.5-flash'). Empty = automatic discovery.
  MODEL_OVERRIDE: '',

  // Used only when automatic discovery fails (network/permission issues).
  FALLBACK_MODELS: Object.freeze([
    'gemini-3.5-flash',
    'gemini-2.5-flash',
    'gemini-3.1-flash-lite',
    'gemini-2.5-flash-lite'
  ]),

  // Models whose names match this pattern are never used for text adaptation.
  EXCLUDED_MODEL_PATTERN: /(tts|image|imagen|banana|live|audio|transcribe|translate|embed|aqa|robotics|omni|cyber|veo|lyria|computer-use|thinking|vision|learnlm|gemma|-exp)/i,

  MAX_MODEL_ATTEMPTS: 4,
  MODEL_CACHE_SECONDS: 21600, // 6h (CacheService maximum)
  MODEL_CACHE_KEY: 'NESSIE_MODEL_V2',
  TEMPERATURE: 0.1,
  MAX_INPUT_CHARS: 20000
});

const PROP_KEYS = Object.freeze({
  API_KEY: 'NESSIE_GEMINI_API_KEY',        // UserProperties, por professor
  SHARED_API_KEY: 'NESSIE_SHARED_API_KEY', // ScriptProperties, chave da escola
  LOCALE: 'NESSIE_LOCALE'
});

// Script-level properties used by the old spreadsheet-based version.
// They are purged on save because Script Properties are COPIED together with
// the document, which would leak the template author's key to every copy.
const LEGACY_SCRIPT_PROP_KEYS = Object.freeze(['SS_ID', 'GEMINI_API_KEY', 'NESSIE_LOCALE']);

const AI_ACTIONS = Object.freeze(['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'ASD', 'CHALLENGE', 'MAKE_VISUAL']);
const LOCAL_ACTIONS = Object.freeze(['PUNCTUATION', 'HIGHLIGHT_COMMANDS', 'ADHD', 'DYSLEXIA']);

// Maps an action to the i18n key of its human-readable label.
const ACTION_LABEL_KEYS = Object.freeze({
  A1: 'BTN_A1', A2: 'BTN_A2', B1: 'BTN_B1', B2: 'BTN_B2', C1: 'BTN_C1', C2: 'BTN_C2',
  ASD: 'BTN_ASD', CHALLENGE: 'BTN_CHALLENGE', MAKE_VISUAL: 'BTN_MAKE_VISUAL'
});
