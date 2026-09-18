/**
 * Nessie — Internationalisation dictionary
 * Supported locales: 'pt' (default) | 'en' | 'es'
 *
 * Server-side: i18n(locale, 'KEY', { param: 'value' })
 * Client-side: _t('KEY', { param: 'value' })  (dictionary injected via template)
 *
 * Placeholders use {name} syntax.
 */

const I18N_DICT = {

  // ── Menu ────────────────────────────────────────────────────────────────────
  MENU_OPEN_SIDEBAR: { pt: 'Abrir painel', en: 'Open sidebar', es: 'Abrir panel' },
  MENU_SETTINGS: { pt: 'Configurações', en: 'Settings', es: 'Configuración' },
  MENU_TEST_API: { pt: 'Testar conexão com a IA', en: 'Test AI connection', es: 'Probar conexión con la IA' },
  MENU_ABOUT: { pt: 'Sobre', en: 'About', es: 'Acerca de' },

  // ── Sidebar sections ────────────────────────────────────────────────────────
  SECTION_PEDAGOGICAL: { pt: 'Adaptações pedagógicas', en: 'Pedagogical adaptations', es: 'Adaptaciones pedagógicas' },
  SECTION_VISUAL: { pt: 'Estruturação visual', en: 'Visual scaffolding', es: 'Andamiaje visual' },
  SECTION_TYPO: { pt: 'Apoios tipográficos', en: 'Typographic supports', es: 'Apoyos tipográficos' },
  SECTION_AUDIO: { pt: 'Leitor de áudio', en: 'Audio reader', es: 'Lector de audio' },
  SECTION_SETTINGS: { pt: 'Configurações', en: 'Settings', es: 'Configuración' },

  // ── Pedagogical buttons ─────────────────────────────────────────────────────
  BTN_A1: { pt: 'A1 Iniciante', en: 'A1 Beginner', es: 'A1 Principiante' },
  BTN_A2: { pt: 'A2 Básico', en: 'A2 Elementary', es: 'A2 Elemental' },
  BTN_B1: { pt: 'B1 Intermediário', en: 'B1 Intermediate', es: 'B1 Intermedio' },
  BTN_B2: { pt: 'B2 Interm. superior', en: 'B2 Upper-int.', es: 'B2 Interm. alto' },
  BTN_C1: { pt: 'C1 Avançado', en: 'C1 Advanced', es: 'C1 Avanzado' },
  BTN_C2: { pt: 'C2 Proficiente', en: 'C2 Proficient', es: 'C2 Maestría' },
  BTN_ASD: { pt: 'Apoio TEA', en: 'ASD support', es: 'Apoyo TEA' },
  BTN_CHALLENGE: { pt: 'Ampliar tarefa', en: 'Extend task', es: 'Ampliar tarea' },

  TOGGLE_GLOSSARY: { pt: 'Gerar glossário', en: 'Generate glossary', es: 'Generar glosario' },
  TOGGLE_CUSTOM_PROMPT: { pt: 'Adicionar instrução extra', en: 'Add extra instruction', es: 'Añadir instrucción extra' },
  CUSTOM_PROMPT_LABEL: { pt: 'Instrução para a IA:', en: 'Instruction for the AI:', es: 'Instrucción para la IA:' },
  CUSTOM_PROMPT_PLACEHOLDER: {
    pt: 'ex.: use exemplos do cotidiano, destaque palavras-chave...',
    en: 'e.g. use everyday examples, emphasise keywords...',
    es: 'ej.: usa ejemplos cotidianos, resalta palabras clave...'
  },

  // ── Visual / typographic ────────────────────────────────────────────────────
  BTN_MAKE_VISUAL: { pt: 'Tornar visual (tabelas e listas)', en: 'Make it visual (tables and lists)', es: 'Hacer visual (tablas y listas)' },  BTN_PUNCTUATION: { pt: 'Realçar pontuação', en: 'Highlight punctuation', es: 'Resaltar puntuación' },
  BTN_COMMANDS: { pt: 'Termos de comando', en: 'Command terms', es: 'Términos de comando' },
  BTN_ADHD: { pt: 'Layout TDAH', en: 'ADHD layout', es: 'Diseño TDAH' },
  BTN_DYSLEXIA: { pt: 'Estilo dislexia', en: 'Dyslexia style', es: 'Estilo dislexia' },

  // ── Audio ───────────────────────────────────────────────────────────────────
  AUDIO_VOICE_LABEL: { pt: 'Voz', en: 'Voice', es: 'Voz' },
  AUDIO_SCANNING: { pt: 'Procurando vozes disponíveis...', en: 'Looking for available voices...', es: 'Buscando voces disponibles...' },
  AUDIO_SPEED_LABEL: { pt: 'Velocidade:', en: 'Speed:', es: 'Velocidad:' },
  BTN_PLAY: { pt: 'Ler seleção', en: 'Read selection', es: 'Leer selección' },
  BTN_STOP: { pt: 'Parar', en: 'Stop', es: 'Detener' },

  // ── Onboarding banner ───────────────────────────────────────────────────────
  ONBOARD_TITLE: { pt: 'Falta um passo', en: 'One step left', es: 'Falta un paso' },
  ONBOARD_TEXT: {
    pt: 'Adicione sua chave gratuita da API Gemini para usar as adaptações com IA. Os apoios tipográficos e o leitor de áudio já funcionam.',
    en: 'Add your free Gemini API key to use AI adaptations. Typographic supports and the audio reader already work.',
    es: 'Añade tu clave gratuita de la API Gemini para usar las adaptaciones con IA. Los apoyos tipográficos y el lector de audio ya funcionan.'
  },
  BTN_OPEN_SETTINGS: { pt: 'Adicionar chave', en: 'Add key', es: 'Añadir clave' },

  // ── Settings dialog ─────────────────────────────────────────────────────────
  SETTINGS_DIALOG_TITLE: { pt: 'Configurações', en: 'Settings', es: 'Configuración' },
  LANG_LABEL: { pt: 'Idioma da interface', en: 'Interface language', es: 'Idioma de la interfaz' },
  SETTINGS_API_LABEL: { pt: 'Chave da API Gemini', en: 'Gemini API key', es: 'Clave de la API Gemini' },
  SETTINGS_API_PLACEHOLDER: { pt: 'Cole aqui sua chave', en: 'Paste your key here', es: 'Pega aquí tu clave' },
  SETTINGS_API_HINT: {
    pt: 'Necessária para as adaptações com IA.',
    en: 'Required for AI adaptations.',
    es: 'Necesaria para las adaptaciones con IA.'
  },
  SETTINGS_KEY_SHARED: {
    pt: 'Usando a chave da escola. Se quiser, cole a sua chave pessoal para usar sua própria cota.',
    en: 'Using the school key. If you prefer, paste your own key to use your personal quota.',
    es: 'Usando la clave de la escuela. Si lo prefieres, pega tu clave personal para usar tu propia cuota.'
  },
  SETTINGS_API_LINK: { pt: 'Obter chave no Google AI Studio', en: 'Get a key at Google AI Studio', es: 'Obtener clave en Google AI Studio' },
  SETTINGS_PRIVACY_HINT: {
    pt: 'A chave fica salva só na sua conta Google, neste documento. Quem recebe uma cópia ou acesso ao documento não vê a sua chave.',
    en: 'The key is saved only to your Google account, for this document. People who copy or share the document cannot see your key.',
    es: 'La clave se guarda solo en tu cuenta de Google, para este documento. Quien copie o acceda al documento no ve tu clave.'
  },
  SETTINGS_KEY_SAVED_AS: { pt: 'Chave salva: {masked}', en: 'Saved key: {masked}', es: 'Clave guardada: {masked}' },
  SETTINGS_KEY_NONE: { pt: 'Nenhuma chave salva.', en: 'No key saved.', es: 'Ninguna clave guardada.' },
  BTN_SHOW: { pt: 'Mostrar', en: 'Show', es: 'Mostrar' },
  BTN_HIDE: { pt: 'Ocultar', en: 'Hide', es: 'Ocultar' },
  BTN_SAVE_SETTINGS: { pt: 'Salvar', en: 'Save', es: 'Guardar' },
  BTN_CANCEL: { pt: 'Fechar', en: 'Close', es: 'Cerrar' },
  BTN_TEST_KEY: { pt: 'Testar chave', en: 'Test key', es: 'Probar clave' },
  BTN_REMOVE_KEY: { pt: 'Remover chave', en: 'Remove key', es: 'Eliminar clave' },
  BTN_REMOVE_CONFIRM: { pt: 'Confirmar remoção', en: 'Confirm removal', es: 'Confirmar eliminación' },
  SETTINGS_SAVED: { pt: 'Configurações salvas.', en: 'Settings saved.', es: 'Configuración guardada.' },
  SETTINGS_ERROR: { pt: 'Não foi possível salvar:', en: 'Could not save:', es: 'No se pudo guardar:' },
  SETTINGS_TESTING: { pt: 'Testando conexão...', en: 'Testing connection...', es: 'Probando conexión...' },
  SETTINGS_KEY_REMOVED: { pt: 'Chave removida.', en: 'Key removed.', es: 'Clave eliminada.' },

  // ── Status bar ──────────────────────────────────────────────────────────────
  STATUS_READY: { pt: 'Pronto', en: 'Ready', es: 'Listo' },
  STATUS_PROCESSING: { pt: 'Processando...', en: 'Processing...', es: 'Procesando...' },
  STATUS_PROCESSING_AI: { pt: 'Adaptando com IA...', en: 'Adapting with AI...', es: 'Adaptando con IA...' },
  STATUS_DONE: { pt: 'Concluído', en: 'Done', es: 'Listo' },
  STATUS_SELECT_TEXT: { pt: 'Selecione um trecho de texto primeiro.', en: 'Select some text first.', es: 'Selecciona un fragmento de texto primero.' },
  STATUS_READING: { pt: 'Lendo em voz alta...', en: 'Reading aloud...', es: 'Leyendo en voz alta...' },
  STATUS_STOPPED: { pt: 'Leitura interrompida', en: 'Reading stopped', es: 'Lectura detenida' },
  STATUS_NO_TTS: { pt: 'Este navegador não oferece leitura em voz alta.', en: 'This browser does not support read-aloud.', es: 'Este navegador no ofrece lectura en voz alta.' },
  STATUS_TTS_ERROR: { pt: 'Erro na leitura: {error}', en: 'Read-aloud error: {error}', es: 'Error de lectura: {error}' },

  // ── Test results ────────────────────────────────────────────────────────────
  TEST_OK: { pt: 'Conexão OK. Modelo em uso: {model}', en: 'Connection OK. Model in use: {model}', es: 'Conexión OK. Modelo en uso: {model}' },

  // ── About ───────────────────────────────────────────────────────────────────
  ABOUT_BODY: {
    pt: '{name} {version}\n{copyright}\nLicença: {license} ({licenseUrl})\n\n{origin}\n\n' +
        'Desenvolvimento: {dev}\nCuradoria pedagógica: {ped}\n\n' +
        'As adaptações com IA usam a {aiProvider}, sujeita aos termos do provedor: {aiTerms}\n' +
        'O texto selecionado é enviado ao provedor apenas quando você usa uma adaptação com IA.\n\n' +
        'Código-fonte: {repo}',
    en: '{name} {version}\n{copyright}\nLicence: {license} ({licenseUrl})\n\n{origin}\n\n' +
        'Development: {dev}\nPedagogical curation: {ped}\n\n' +
        'AI adaptations use the {aiProvider}, subject to the provider\'s terms: {aiTerms}\n' +
        'The selected text is sent to the provider only when you use an AI adaptation.\n\n' +
        'Source code: {repo}',
    es: '{name} {version}\n{copyright}\nLicencia: {license} ({licenseUrl})\n\n{origin}\n\n' +
        'Desarrollo: {dev}\nCuraduría pedagógica: {ped}\n\n' +
        'Las adaptaciones con IA usan la {aiProvider}, sujeta a los términos del proveedor: {aiTerms}\n' +
        'El texto seleccionado se envía al proveedor solo cuando usas una adaptación con IA.\n\n' +
        'Código fuente: {repo}'
  },

  // ── Labels inserted into the document ───────────────────────────────────────
  DOC_ADAPTED: { pt: '——— TEXTO ADAPTADO · {mode} ———', en: '——— ADAPTED TEXT · {mode} ———', es: '——— TEXTO ADAPTADO · {mode} ———' },
  DOC_GLOSSARY: { pt: 'GLOSSÁRIO', en: 'GLOSSARY', es: 'GLOSARIO' },
  DOC_COMMANDS: { pt: 'DEFINIÇÕES DOS TERMOS DE COMANDO', en: 'COMMAND TERM DEFINITIONS', es: 'DEFINICIONES DE LOS TÉRMINOS DE COMANDO' },

  // ── Errors (codes are referenced by nessieError_) ───────────────────────────
  ERR_NO_SELECTION: { pt: 'Selecione um trecho de texto primeiro.', en: 'Select some text first.', es: 'Selecciona un fragmento de texto primero.' },
  ERR_API_KEY_MISSING: {
    pt: 'Nenhuma chave da API Gemini configurada. Abra Configurações e cole sua chave.',
    en: 'No Gemini API key configured. Open Settings and paste your key.',
    es: 'No hay clave de la API Gemini configurada. Abre Configuración y pega tu clave.'
  },
  ERR_API_KEY_FORMAT: {
    pt: 'A chave informada não parece uma chave válida da API Gemini.',
    en: 'The value entered does not look like a valid Gemini API key.',
    es: 'El valor introducido no parece una clave válida de la API Gemini.'
  },
  ERR_API_KEY_INVALID: {
    pt: 'A chave foi recusada pelo Google. Confira se ela está correta e ativa no AI Studio.',
    en: 'Google rejected the key. Check that it is correct and active in AI Studio.',
    es: 'Google rechazó la clave. Comprueba que sea correcta y esté activa en AI Studio.'
  },
  ERR_QUOTA: {
    pt: 'Limite de uso da API atingido. Aguarde um minuto e tente novamente.',
    en: 'API usage limit reached. Wait a minute and try again.',
    es: 'Límite de uso de la API alcanzado. Espera un minuto e inténtalo de nuevo.'
  },
  ERR_AI_FAILED: {
    pt: 'A IA não conseguiu gerar a adaptação. Detalhes: {details}',
    en: 'The AI could not generate the adaptation. Details: {details}',
    es: 'La IA no pudo generar la adaptación. Detalles: {details}'
  },
  ERR_TEXT_TOO_LONG: {
    pt: 'Seleção muito longa ({count} caracteres). Selecione no máximo {max}.',
    en: 'Selection too long ({count} characters). Select at most {max}.',
    es: 'Selección demasiado larga ({count} caracteres). Selecciona como máximo {max}.'
  },
  ERR_UNKNOWN_ACTION: { pt: 'Ação desconhecida: {action}', en: 'Unknown action: {action}', es: 'Acción desconocida: {action}' },
  ERR_LOCALE: { pt: 'Idioma não suportado: {locale}', en: 'Unsupported language: {locale}', es: 'Idioma no soportado: {locale}' },
  ERR_NETWORK: {
    pt: 'Falha de conexão com a API Gemini: {details}',
    en: 'Could not reach the Gemini API: {details}',
    es: 'No se pudo conectar con la API Gemini: {details}'
  },
  ERR_GENERIC: { pt: 'Erro: {details}', en: 'Error: {details}', es: 'Error: {details}' }
};

/**
 * Server-side translation helper.
 * @param {string} locale  'pt' | 'en' | 'es'
 * @param {string} key     key from I18N_DICT
 * @param {Object=} params values for {placeholders}
 * @returns {string}
 */
function i18n(locale, key, params) {
  const entry = I18N_DICT[key];
  let text = entry ? (entry[locale] || entry[LOCALES.DEFAULT] || key) : key;
  if (params) {
    Object.keys(params).forEach(function (name) {
      text = text.split('{' + name + '}').join(String(params[name]));
    });
  }
  return text;
}
