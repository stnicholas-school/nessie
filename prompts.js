/**
 * Nessie — AI prompts and typographic presets
 * ---------------------------------------------------------------------------
 * LANGUAGE POLICY
 * Prompts are written in English on purpose: they are read by the model, not
 * by students, and English instructions give the most consistent adherence.
 * The OUTPUT language is always the language of the selected text. That is
 * enforced in three layers:
 *   1. gemini.js detects the text language and names it explicitly;
 *   2. a language lock is placed at the START and END of the system prompt;
 *   3. every mode below opens with LANGUAGE_PRESERVATION.
 * CEFR levels (A1–C2) are used as COMPLEXITY targets only, in any language.
 */

const FORMAT_SETTINGS = Object.freeze({
  ADHD: { font: 'Verdana', size: 12, lineSpacing: 2.0, alignment: 'LEFT', spacingBefore: 18, spacingAfter: 18 },
  DYSLEXIA: { font: 'Comic Sans MS', size: 13, lineSpacing: 1.5, alignment: 'LEFT', spacingBefore: 10, spacingAfter: 10 },
  DEFAULT: { font: 'Arial', size: 11, lineSpacing: 1.15, alignment: 'JUSTIFIED', spacingBefore: 0, spacingAfter: 0 }
});

const LANGUAGE_PRESERVATION =
  'Write your entire response in the exact same language as the source text -- do not translate it into English or any other language. ';

const AI_CONFIG = Object.freeze({
  SYSTEM_IDENTITY:
    'ACT AS A PEDAGOGICAL CONTENT EDITOR FOR SCHOOL TEACHERS. RETURN ONLY THE REQUESTED RESULT. ' +
    "DO NOT ADD EXPLANATIONS, COMMENTS, INTRODUCTIONS OR 'NEXT STEPS' MESSAGES.",

  CORE_RULES: [
    'RULE 1: If the text contains explicit questions to the reader (not rhetorical), DO NOT answer them. Only rewrite them following the adaptation rules.',
    'RULE 2: If the text is informative or expository, DO NOT create new questions when adapting (unless the task mode explicitly asks for one).',
    'RULE 3: Identify 3 to 5 keywords in the adapted text and wrap each one in [[double brackets]].',
    "RULE 4: If a glossary is requested, put it ONLY in the 'glossary' field, one entry per line, formatted as 'term: short definition'. Never put the glossary inside 'adaptedText'.",
    'RULE 5: ANTI-SPOILER: if the text asks the reader to define or explain a term, do not include that term in the glossary.',
    'RULE 6: NO EMOJIS.',
    'RULE 7: NO MARKDOWN (#, **, *, -, >). Use plain text and line breaks. The ONLY exception is a pipe table when the task mode explicitly requires a table.',
    "RULE 8: NEVER return an empty 'adaptedText'. If the source is very short, a fragment or ambiguous, still adapt it as well as possible.",
    'RULE 9: Preserve the meaning, facts, names, numbers and formulas of the source text.'
  ].join('\n'),

  MODES: Object.freeze({
    A1: LANGUAGE_PRESERVATION +
      'Within that language, rewrite the text to CEFR A1 (Breakthrough) complexity: only the ~500 most frequent words of that language, ' +
      'extremely short and simple sentences (Subject-Verb-Object), only simple present tense and basic equivalents of "to be", ' +
      'no metaphors or idioms, concrete everyday vocabulary only.',

    A2: LANGUAGE_PRESERVATION +
      'Within that language, rewrite the text to CEFR A2 (Waystage) complexity: roughly the 1000 most common words of that language, ' +
      'simple connectors equivalent to "and", "but", "because", basic past tense and near-future constructions, ' +
      'direct sentences without complex subordinate clauses.',

    B1: LANGUAGE_PRESERVATION +
      'Within that language, rewrite the text to CEFR B1 (Threshold) complexity: standard clear language, focus on the main points, ' +
      'break down complex vocabulary into clear descriptive sentences.',

    B2: LANGUAGE_PRESERVATION +
      'Within that language, rewrite the text to CEFR B2 (Vantage) complexity: clear treatment of concrete and abstract topics, ' +
      'including technical and academic discussion, wider vocabulary with abstract terms, complex sentence structures while keeping clarity.',

    C1: LANGUAGE_PRESERVATION +
      'Within that language, rewrite the text to CEFR C1 (Advanced) complexity: preserve all technical nuance and implicit meaning, ' +
      'use sophisticated discourse markers and precise academic vocabulary native to that language, reorganise for flow without losing detail.',

    C2: LANGUAGE_PRESERVATION +
      'Within that language, rewrite the text to CEFR C2 (Proficient) complexity: elevate vocabulary to the highest academic standard of that language, ' +
      'polish phrasing while preserving structure and every detail.',

    ASD: LANGUAGE_PRESERVATION +
      'Within that language, apply ASD-support literal-language rules: remove all metaphors, sarcasm and ambiguous idioms; ' +
      'enforce a strict logical sequence of ideas using that language\'s natural equivalents of "First, Then, Finally"; ' +
      'keep every instruction explicit, with nothing left to be read between the lines. Put each step or idea on its own line.',

    MAKE_VISUAL: LANGUAGE_PRESERVATION +
      'Within that language, REORGANISE the text into a visual, skimmable layout that a student can understand at a glance. ' +
      'This is NOT an exercise: do NOT create blanks, gaps, lines to fill in, or questions. ' +
      'Do NOT remove content: every fact, name, number and relationship in the source text must still appear in your output. ' +
      'Pick the SINGLE structure that fits the content best, and never mix two structures for the same content:\n' +
      '(A) COMPARISON OR CATEGORIES: if the text compares items, groups things into categories, or pairs terms with definitions, causes, ' +
      'examples or characteristics, you MUST output a pipe table. Every table line starts and ends with |, the first line is the header row, ' +
      'the second line is a separator such as |---|---|, and each item gets one row. Column headers are the criteria being compared ' +
      '(for example: Group | Body covering | Breathing | Reproduction). Keep each cell to a few words.\n' +
      '(B) PROCESS, SEQUENCE OR TIMELINE: output one numbered step per line (1., 2., 3.), one action or stage per step, in order. ' +
      'Start a step with its date or stage name when the text gives one.\n' +
      '(C) TOPIC WITH PARTS: if the text presents a concept and its components, output one item per line, each line starting with "• ", ' +
      'and put the term first, then a short explanation after a colon.\n' +
      'In every case: start with one short title line naming what is shown; keep each line to one idea; break long sentences apart; ' +
      'no paragraph longer than two lines; mark 3 to 5 key terms with [[double brackets]]. ' +
      'If the text clearly covers two different things (for example a comparison and then a process), you may output two blocks, ' +
      'each with its own title line.',

    CHALLENGE: LANGUAGE_PRESERVATION +
      'Within that language, keep the text intact and append, on a new line, one extending question (in that same language) ' +
      "that requires higher-order thinking (Synthesis or Evaluation in Bloom's Taxonomy) based on the content."
  })
});
