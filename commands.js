/**
 * Nessie — Command terms dictionary (non-AI)
 * ---------------------------------------------------------------------------
 * Used by "Termos de comando" / "Command terms". Each entry has:
 *   term:       canonical label shown in the definitions list
 *   forms:      every surface form to highlight (imperative, infinitive, ...)
 *   definition: short, student-friendly definition
 *
 * The dictionary is chosen by the detected language of the selected text,
 * falling back to the user's interface language.
 */

const COMMAND_TERMS = Object.freeze({

  pt: [
    { term: 'Analise', forms: ['Analise', 'Analisar'], definition: 'Divida o assunto em partes para mostrar como elas se organizam e se relacionam.' },
    { term: 'Anote', forms: ['Anote', 'Anotar'], definition: 'Acrescente observações curtas a um texto, diagrama ou gráfico.' },
    { term: 'Argumente', forms: ['Argumente', 'Argumentar'], definition: 'Defenda uma posição com razões e evidências.' },
    { term: 'Avalie', forms: ['Avalie', 'Avaliar'], definition: 'Julgue algo pesando pontos fortes e limitações, e chegue a uma conclusão.' },
    { term: 'Calcule', forms: ['Calcule', 'Calcular'], definition: 'Encontre um resultado numérico, mostrando as etapas do cálculo.' },
    { term: 'Classifique', forms: ['Classifique', 'Classificar'], definition: 'Organize elementos em grupos de acordo com características em comum.' },
    { term: 'Compare e contraste', forms: ['Compare e contraste', 'Comparar e contrastar'], definition: 'Mostre as semelhanças e as diferenças entre dois ou mais elementos.' },
    { term: 'Compare', forms: ['Compare', 'Comparar'], definition: 'Mostre as semelhanças entre dois ou mais elementos, citando cada um deles.' },
    { term: 'Construa', forms: ['Construa', 'Construir'], definition: 'Apresente informações em forma de diagrama, tabela ou estrutura lógica.' },
    { term: 'Contraste', forms: ['Contraste', 'Contrastar'], definition: 'Mostre as diferenças entre dois ou mais elementos, citando cada um deles.' },
    { term: 'Deduza', forms: ['Deduza', 'Deduzir'], definition: 'Chegue a uma conclusão que decorre logicamente das informações dadas.' },
    { term: 'Defina', forms: ['Defina', 'Definir'], definition: 'Dê o significado preciso de uma palavra, expressão ou conceito.' },
    { term: 'Demonstre', forms: ['Demonstre', 'Demonstrar', 'Mostre', 'Mostrar'], definition: 'Apresente as etapas ou evidências que provam um resultado.' },
    { term: 'Descreva', forms: ['Descreva', 'Descrever'], definition: 'Apresente as características de algo com detalhes.' },
    { term: 'Desenhe', forms: ['Desenhe', 'Desenhar'], definition: 'Represente com um diagrama ou gráfico preciso e identificado.' },
    { term: 'Determine', forms: ['Determine', 'Determinar'], definition: 'Encontre a única resposta possível.' },
    { term: 'Diferencie', forms: ['Diferencie', 'Diferenciar', 'Distinga', 'Distinguir'], definition: 'Deixe claras as diferenças entre dois ou mais conceitos ou elementos.' },
    { term: 'Discuta', forms: ['Discuta', 'Discutir'], definition: 'Apresente diferentes argumentos, fatores ou pontos de vista, apoiados em evidências.' },
    { term: 'Em que medida', forms: ['Em que medida', 'Até que ponto'], definition: 'Considere os pontos a favor e contra uma ideia e chegue a uma conclusão justificada.' },
    { term: 'Esboce', forms: ['Esboce', 'Esboçar'], definition: 'Faça um desenho ou gráfico simples que mostre a forma geral ou os aspectos principais.' },
    { term: 'Estime', forms: ['Estime', 'Estimar'], definition: 'Encontre um valor aproximado.' },
    { term: 'Explique', forms: ['Explique', 'Explicar'], definition: 'Apresente algo com detalhes, incluindo razões ou causas.' },
    { term: 'Identifique', forms: ['Identifique', 'Identificar'], definition: 'Reconheça e nomeie, ou escolha uma resposta entre várias possibilidades.' },
    { term: 'Indique', forms: ['Indique', 'Indicar', 'Cite', 'Citar'], definition: 'Dê um nome, valor ou resposta curta, sem explicação.' },
    { term: 'Interprete', forms: ['Interprete', 'Interpretar'], definition: 'Use o que você sabe para reconhecer tendências e tirar conclusões a partir das informações.' },
    { term: 'Justifique', forms: ['Justifique', 'Justificar'], definition: 'Apresente razões ou evidências válidas que apoiem uma resposta ou conclusão.' },
    { term: 'Legende', forms: ['Legende', 'Legendar', 'Rotule', 'Rotular'], definition: 'Acrescente nomes ou legendas a um diagrama ou imagem.' },
    { term: 'Liste', forms: ['Liste', 'Listar', 'Enumere', 'Enumerar'], definition: 'Escreva uma sequência de respostas curtas, sem explicação.' },
    { term: 'Preveja', forms: ['Preveja', 'Prever'], definition: 'Diga o que provavelmente vai acontecer com base nas informações disponíveis.' },
    { term: 'Resolva', forms: ['Resolva', 'Resolver'], definition: 'Encontre a resposta usando métodos adequados.' },
    { term: 'Resuma', forms: ['Resuma', 'Resumir'], definition: 'Apresente as ideias principais de forma curta.' },
    { term: 'Sugira', forms: ['Sugira', 'Sugerir'], definition: 'Proponha uma possível solução, hipótese ou explicação.' }
  ],

  en: [
    { term: 'Analyse', forms: ['Analyse', 'Analyze'], definition: 'Break something down into parts to show how they are organised and related.' },
    { term: 'Annotate', forms: ['Annotate'], definition: 'Add brief notes to a text, diagram or graph.' },
    { term: 'Calculate', forms: ['Calculate'], definition: 'Find a numerical answer, showing the working.' },
    { term: 'Classify', forms: ['Classify'], definition: 'Sort items into groups based on shared characteristics.' },
    { term: 'Compare and contrast', forms: ['Compare and contrast'], definition: 'Show both the similarities and the differences between two or more items.' },
    { term: 'Compare', forms: ['Compare'], definition: 'Show the similarities between two or more items, referring to each one.' },
    { term: 'Construct', forms: ['Construct'], definition: 'Present information as a diagram, table or logical structure.' },
    { term: 'Contrast', forms: ['Contrast'], definition: 'Show the differences between two or more items, referring to each one.' },
    { term: 'Deduce', forms: ['Deduce'], definition: 'Reach a conclusion that follows logically from the information given.' },
    { term: 'Define', forms: ['Define'], definition: 'Give the precise meaning of a word, phrase or concept.' },
    { term: 'Describe', forms: ['Describe'], definition: 'Give a detailed account of the features of something.' },
    { term: 'Determine', forms: ['Determine'], definition: 'Find the only possible answer.' },
    { term: 'Discuss', forms: ['Discuss'], definition: 'Present a range of arguments, factors or viewpoints, supported by evidence.' },
    { term: 'Distinguish', forms: ['Distinguish'], definition: 'Make the differences between two or more concepts or items clear.' },
    { term: 'Draw', forms: ['Draw'], definition: 'Represent with an accurate, labelled diagram or graph.' },
    { term: 'Estimate', forms: ['Estimate'], definition: 'Find an approximate value.' },
    { term: 'Evaluate', forms: ['Evaluate'], definition: 'Judge something by weighing up strengths and limitations, and reach a conclusion.' },
    { term: 'Explain', forms: ['Explain'], definition: 'Give a detailed account that includes reasons or causes.' },
    { term: 'Identify', forms: ['Identify'], definition: 'Recognise and name, or choose an answer from several possibilities.' },
    { term: 'Interpret', forms: ['Interpret'], definition: 'Use knowledge to recognise trends and draw conclusions from information.' },
    { term: 'Justify', forms: ['Justify'], definition: 'Give valid reasons or evidence to support an answer or conclusion.' },
    { term: 'Label', forms: ['Label'], definition: 'Add names or captions to a diagram or image.' },
    { term: 'List', forms: ['List'], definition: 'Give a sequence of brief answers with no explanation.' },
    { term: 'Outline', forms: ['Outline'], definition: 'Give a brief account or summary.' },
    { term: 'Predict', forms: ['Predict'], definition: 'Say what is likely to happen based on the information available.' },
    { term: 'Sketch', forms: ['Sketch'], definition: 'Draw a simple diagram or graph showing the general shape or key features.' },
    { term: 'Solve', forms: ['Solve'], definition: 'Find the answer using appropriate methods.' },
    { term: 'State', forms: ['State'], definition: 'Give a name, value or short answer with no explanation.' },
    { term: 'Suggest', forms: ['Suggest'], definition: 'Propose a possible solution, hypothesis or explanation.' },
    { term: 'Summarise', forms: ['Summarise', 'Summarize'], definition: 'Present the main ideas in a short form.' },
    { term: 'To what extent', forms: ['To what extent'], definition: 'Weigh up the arguments for and against an idea and reach a supported conclusion.' }
  ],

  es: [
    { term: 'Analice', forms: ['Analice', 'Analiza', 'Analizar'], definition: 'Divide el tema en partes para mostrar cómo se organizan y se relacionan.' },
    { term: 'Anote', forms: ['Anote', 'Anota', 'Anotar'], definition: 'Añade observaciones breves a un texto, diagrama o gráfico.' },
    { term: 'Calcule', forms: ['Calcule', 'Calcula', 'Calcular'], definition: 'Encuentra un resultado numérico, mostrando los pasos.' },
    { term: 'Clasifique', forms: ['Clasifique', 'Clasifica', 'Clasificar'], definition: 'Organiza elementos en grupos según características comunes.' },
    { term: 'Compare y contraste', forms: ['Compare y contraste', 'Compara y contrasta', 'Comparar y contrastar'], definition: 'Muestra las semejanzas y las diferencias entre dos o más elementos.' },
    { term: 'Compare', forms: ['Compare', 'Compara', 'Comparar'], definition: 'Muestra las semejanzas entre dos o más elementos, mencionando cada uno.' },
    { term: 'Construya', forms: ['Construya', 'Construye', 'Construir'], definition: 'Presenta información en forma de diagrama, tabla o estructura lógica.' },
    { term: 'Contraste', forms: ['Contraste', 'Contrasta', 'Contrastar'], definition: 'Muestra las diferencias entre dos o más elementos, mencionando cada uno.' },
    { term: 'Deduzca', forms: ['Deduzca', 'Deduce', 'Deducir'], definition: 'Llega a una conclusión que se sigue lógicamente de la información dada.' },
    { term: 'Defina', forms: ['Defina', 'Define', 'Definir'], definition: 'Da el significado preciso de una palabra, expresión o concepto.' },
    { term: 'Describa', forms: ['Describa', 'Describe', 'Describir'], definition: 'Presenta con detalle las características de algo.' },
    { term: 'Determine', forms: ['Determine', 'Determina', 'Determinar'], definition: 'Encuentra la única respuesta posible.' },
    { term: 'Dibuje', forms: ['Dibuje', 'Dibuja', 'Dibujar'], definition: 'Representa con un diagrama o gráfico preciso y rotulado.' },
    { term: 'Discuta', forms: ['Discuta', 'Discute', 'Discutir'], definition: 'Presenta distintos argumentos, factores o puntos de vista, apoyados en evidencias.' },
    { term: 'Distinga', forms: ['Distinga', 'Distingue', 'Distinguir'], definition: 'Deja claras las diferencias entre dos o más conceptos o elementos.' },
    { term: 'En qué medida', forms: ['En qué medida', 'Hasta qué punto'], definition: 'Considera los argumentos a favor y en contra de una idea y llega a una conclusión justificada.' },
    { term: 'Enumere', forms: ['Enumere', 'Enumera', 'Enumerar'], definition: 'Escribe una secuencia de respuestas breves, sin explicación.' },
    { term: 'Esboce', forms: ['Esboce', 'Esboza', 'Esbozar'], definition: 'Haz un dibujo o gráfico simple que muestre la forma general o los rasgos principales.' },
    { term: 'Estime', forms: ['Estime', 'Estima', 'Estimar'], definition: 'Encuentra un valor aproximado.' },
    { term: 'Evalúe', forms: ['Evalúe', 'Evalúa', 'Evaluar'], definition: 'Juzga algo sopesando fortalezas y limitaciones, y llega a una conclusión.' },
    { term: 'Explique', forms: ['Explique', 'Explica', 'Explicar'], definition: 'Presenta algo con detalle, incluyendo razones o causas.' },
    { term: 'Identifique', forms: ['Identifique', 'Identifica', 'Identificar'], definition: 'Reconoce y nombra, o elige una respuesta entre varias posibilidades.' },
    { term: 'Indique', forms: ['Indique', 'Indica', 'Indicar'], definition: 'Da un nombre, valor o respuesta breve, sin explicación.' },
    { term: 'Interprete', forms: ['Interprete', 'Interpreta', 'Interpretar'], definition: 'Usa lo que sabes para reconocer tendencias y sacar conclusiones de la información.' },
    { term: 'Justifique', forms: ['Justifique', 'Justifica', 'Justificar'], definition: 'Da razones o evidencias válidas que apoyen una respuesta o conclusión.' },
    { term: 'Prediga', forms: ['Prediga', 'Predice', 'Predecir'], definition: 'Di lo que probablemente ocurrirá según la información disponible.' },
    { term: 'Resuelva', forms: ['Resuelva', 'Resuelve', 'Resolver'], definition: 'Encuentra la respuesta usando métodos adecuados.' },
    { term: 'Resuma', forms: ['Resuma', 'Resume', 'Resumir'], definition: 'Presenta las ideas principales de forma breve.' },
    { term: 'Rotule', forms: ['Rotule', 'Rotula', 'Rotular'], definition: 'Añade nombres o leyendas a un diagrama o imagen.' },
    { term: 'Sugiera', forms: ['Sugiera', 'Sugiere', 'Sugerir'], definition: 'Propón una posible solución, hipótesis o explicación.' }
  ]
});
