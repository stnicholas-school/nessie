/**
 * Nessie — Document engine
 * ---------------------------------------------------------------------------
 * Local (non-AI) formatting operations and rendering of AI output into the
 * Google Doc (paragraphs, pipe tables, [[keywords]], glossary).
 */

// ─── Selection helpers ────────────────────────────────────────────────────────

/**
 * Normalises the active selection into editable text segments.
 * Works for partial selections (TEXT) and fully selected elements
 * (PARAGRAPH, LIST_ITEM, TABLE_CELL...) via editAsText().
 * @returns {Array<{element:GoogleAppsScript.Document.Element, textEl:GoogleAppsScript.Document.Text, start:number, end:number, text:string}>}
 */
function collectSelection_(doc) {
  const selection = doc.getSelection();
  if (!selection) return [];

  const segments = [];
  selection.getRangeElements().forEach(function (rangeElement) {
    const element = rangeElement.getElement();
    let textEl = null;

    if (element.getType() === DocumentApp.ElementType.TEXT) {
      textEl = element.asText();
    } else if (typeof element.editAsText === 'function') {
      textEl = element.editAsText();
    }
    if (!textEl) return;

    const fullText = textEl.getText();
    if (!fullText.length) return;

    const start = rangeElement.isPartial() ? rangeElement.getStartOffset() : 0;
    const end = rangeElement.isPartial() ? rangeElement.getEndOffsetInclusive() : fullText.length - 1;
    if (end < start) return;

    const text = fullText.substring(start, end + 1);
    if (!text.trim()) return;

    segments.push({ element: element, textEl: textEl, start: start, end: end, text: text });
  });

  return segments;
}

/** Index of the body-level ancestor of an element, or -1 if outside the body. */
function getTopLevelIndex_(body, element) {
  let current = element;
  while (current) {
    const parent = current.getParent();
    if (!parent) return -1;
    if (parent.getType() === DocumentApp.ElementType.BODY_SECTION) return body.getChildIndex(current);
    current = parent;
  }
  return -1;
}

function getSafeParagraph_(element) {
  let current = element;
  while (current) {
    const type = current.getType();
    if (type === DocumentApp.ElementType.PARAGRAPH) return current.asParagraph();
    if (type === DocumentApp.ElementType.LIST_ITEM) return current.asListItem();
    current = current.getParent();
  }
  return null;
}

// ─── Local operations (no AI) ─────────────────────────────────────────────────

function highlightPunctuation(textEl, start, end) {
  const text = textEl.getText();
  const regex = /[.?!,:;¿¡]/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index < start) continue;
    if (match.index > end) break;
    textEl.setBackgroundColor(match.index, match.index, '#FFFF00');
    textEl.setFontSize(match.index, match.index, 14);
    textEl.setBold(match.index, match.index, true);
  }
}

/**
 * Highlights command terms inside [start, end].
 * Longest form wins on overlap ("Compare e contraste" over "Compare").
 * @returns {Array<{term:string, definition:string}>} unique entries found
 */
function highlightCommands(textEl, start, end, langCode) {
  const entries = COMMAND_TERMS[langCode] || COMMAND_TERMS[LOCALES.DEFAULT];
  const text = textEl.getText();
  const hits = [];

  entries.forEach(function (entry) {
    entry.forms.forEach(function (form) {
      const regex = buildTermRegex_(form);
      let match;
      while ((match = regex.exec(text)) !== null) {
        const hitStart = match.index;
        const hitEnd = match.index + match[0].length - 1;
        if (hitStart >= start && hitEnd <= end) {
          hits.push({ start: hitStart, end: hitEnd, entry: entry });
        }
      }
    });
  });

  hits.sort(function (a, b) {
    return (a.start - b.start) || ((b.end - b.start) - (a.end - a.start));
  });

  const found = [];
  let lastEnd = -1;
  hits.forEach(function (hit) {
    if (hit.start <= lastEnd) return;
    textEl.setBackgroundColor(hit.start, hit.end, '#CCEEFF');
    textEl.setBold(hit.start, hit.end, true);
    lastEnd = hit.end;
    if (found.indexOf(hit.entry) === -1) found.push(hit.entry);
  });

  return found;
}

/** Unicode-aware whole-word matcher (JS \b does not understand accented letters). */
function buildTermRegex_(form) {
  const escaped = form
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    .replace(/\s+/g, '\\s+');
  return new RegExp('(?<![\\p{L}\\p{N}_])' + escaped + '(?![\\p{L}\\p{N}_])', 'giu');
}

function appendCommandsGlossary_(doc, entries, langCode) {
  const body = doc.getBody();
  body.appendHorizontalRule();

  const header = body.appendParagraph(i18n(langCode, 'DOC_COMMANDS'));
  styleParagraph_(header, { color: APP_CONFIG.PRIMARY_COLOR, bold: true, size: 11 });

  entries
    .slice()
    .sort(function (a, b) { return a.term.localeCompare(b.term, langCode); })
    .forEach(function (entry) {
      const line = body.appendParagraph(entry.term + ': ' + entry.definition);
      styleParagraph_(line, { size: 10 });
      line.editAsText().setBold(0, entry.term.length, true);
    });
}

function applyPedagogicalFormatting(textEl, start, end, mode, element) {
  const settings = FORMAT_SETTINGS[mode] || FORMAT_SETTINGS.DEFAULT;

  textEl.setFontFamily(start, end, settings.font);
  textEl.setFontSize(start, end, settings.size);
  if (mode === 'DYSLEXIA') textEl.setItalic(start, end, false);

  const para = getSafeParagraph_(element || textEl);
  if (!para) return;

  para.setLineSpacing(settings.lineSpacing);
  para.setAlignment(settings.alignment === 'LEFT'
    ? DocumentApp.HorizontalAlignment.LEFT
    : DocumentApp.HorizontalAlignment.JUSTIFY);
  para.setSpacingBefore(settings.spacingBefore);
  para.setSpacingAfter(settings.spacingAfter);
}

function markOriginal_(segment) {
  segment.textEl.setStrikethrough(segment.start, segment.end, true);
  segment.textEl.setForegroundColor(segment.start, segment.end, APP_CONFIG.ORIGINAL_TEXT_COLOR);
}

// ─── AI output rendering ──────────────────────────────────────────────────────

/**
 * Inserts the adapted block at a body index.
 * @param {GoogleAppsScript.Document.Body} body
 * @param {number} index
 * @param {{header:string, text:string, glossary:string, glossaryTitle:string}} content
 * @returns {number} next free body index
 */
function insertAdaptedContent_(body, index, content) {
  let cursor = Math.min(index, body.getNumChildren());

  const header = body.insertParagraph(cursor++, content.header);
  styleParagraph_(header, { color: APP_CONFIG.PRIMARY_COLOR, bold: true, size: 10 });

  parseAdaptedBlocks_(content.text).forEach(function (block) {
    if (block.type === 'table') {
      insertTable_(body, cursor++, block.rows);
      return;
    }
    const p = body.insertParagraph(cursor++, block.text);
    styleParagraph_(p, { color: APP_CONFIG.ADAPTED_TEXT_COLOR });
    renderParagraphMarkup_(p, APP_CONFIG.PRIMARY_COLOR);
  });

  if (content.glossary) {
    const title = body.insertParagraph(cursor++, content.glossaryTitle);
    styleParagraph_(title, { color: APP_CONFIG.GLOSSARY_TEXT_COLOR, bold: true, size: 10 });

    content.glossary
      .replace(/\r\n?/g, '\n')
      .split('\n')
      .map(function (line) { return cleanLine_(line.trim()); })
      .filter(function (line) { return line !== ''; })
      .forEach(function (line) {
        const p = body.insertParagraph(cursor++, line);
        styleParagraph_(p, { color: APP_CONFIG.GLOSSARY_TEXT_COLOR, italic: true, size: 10 });
        renderParagraphMarkup_(p, null);
        const text = p.editAsText();
        const colon = text.getText().indexOf(':');
        if (colon > 0 && colon <= 60) text.setBold(0, colon - 1, true);
      });
  }

  const spacer = body.insertParagraph(cursor++, '');
  styleParagraph_(spacer, {});
  return cursor;
}

/** Splits AI text into paragraph and table blocks. */
function parseAdaptedBlocks_(raw) {
  const lines = String(raw || '').replace(/\r\n?/g, '\n').split('\n');
  const blocks = [];
  let table = null;

  const flushTable = function () {
    if (table && table.rows.length) blocks.push(table);
    table = null;
  };

  lines.forEach(function (line) {
    const trimmed = line.trim();

    if (trimmed.length > 1 && trimmed.charAt(0) === '|') {
      if (!table) table = { type: 'table', rows: [] };
      const isSeparator = /^\|[\s:|-]+\|?$/.test(trimmed) && trimmed.indexOf('-') !== -1;
      if (!isSeparator) table.rows.push(splitTableRow_(trimmed));
      return;
    }

    flushTable();

    if (trimmed === '') {
      const last = blocks[blocks.length - 1];
      if (last && last.type === 'paragraph' && last.text !== '') blocks.push({ type: 'paragraph', text: '' });
      return;
    }

    blocks.push({ type: 'paragraph', text: cleanLine_(trimmed) });
  });

  flushTable();

  while (blocks.length && blocks[blocks.length - 1].type === 'paragraph' && blocks[blocks.length - 1].text === '') {
    blocks.pop();
  }
  return blocks;
}

function splitTableRow_(line) {
  return line
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map(function (cell) { return cleanLine_(cell.trim()); });
}

/** Removes stray Markdown the model may still emit (headings, bullets, quotes). */
function cleanLine_(line) {
  return line
    .replace(/^#{1,6}\s+/, '')
    .replace(/^>\s?/, '')
    .replace(/^[*\-]\s+/, '• ');
}

function insertTable_(body, index, rows) {
  const width = rows.reduce(function (max, row) { return Math.max(max, row.length); }, 0);
  const cells = rows.map(function (row) {
    const padded = row.slice();
    while (padded.length < width) padded.push('');
    return padded;
  });

  const table = body.insertTable(index, cells);
  table.setBorderColor(APP_CONFIG.PRIMARY_COLOR);

  for (let r = 0; r < table.getNumRows(); r++) {
    const row = table.getRow(r);
    for (let c = 0; c < row.getNumCells(); c++) {
      const cell = row.getCell(c);
      const text = cell.editAsText();
      const length = text.getText().length;

      if (r === 0) cell.setBackgroundColor('#EEF4FF');
      if (!length) continue;

      text.setStrikethrough(false);
      text.setForegroundColor(APP_CONFIG.ADAPTED_TEXT_COLOR);
      text.setBold(r === 0);
      renderInlineMarkup_(text, 0, length - 1, APP_CONFIG.PRIMARY_COLOR);
    }
  }
  return table;
}

function renderParagraphMarkup_(paragraph, keywordColor) {
  const text = paragraph.editAsText();
  const length = text.getText().length;
  if (length) renderInlineMarkup_(text, 0, length - 1, keywordColor);
}

/**
 * Converts [[keyword]] (bold + underline + colour) and **bold** inside
 * [from, to]. Processes matches backwards so offsets stay valid.
 * @returns {number} new inclusive end offset
 */
function renderInlineMarkup_(textEl, from, to, keywordColor) {
  if (to < from) return to;

  const segment = textEl.getText().substring(from, to + 1);
  const regex = /\[\[([\s\S]*?)\]\]|\*\*([\s\S]+?)\*\*/g;
  const matches = [];
  let match;
  while ((match = regex.exec(segment)) !== null) {
    matches.push({ index: from + match.index, length: match[0].length, isKeyword: match[1] !== undefined });
  }

  for (let i = matches.length - 1; i >= 0; i--) {
    const m = matches[i];
    const innerLength = m.length - 4;

    textEl.deleteText(m.index + m.length - 2, m.index + m.length - 1);
    textEl.deleteText(m.index, m.index + 1);
    to -= 4;

    if (innerLength > 0) {
      const innerEnd = m.index + innerLength - 1;
      textEl.setBold(m.index, innerEnd, true);
      if (m.isKeyword) {
        textEl.setUnderline(m.index, innerEnd, true);
        if (keywordColor) textEl.setForegroundColor(m.index, innerEnd, keywordColor);
      }
    }
  }
  return to;
}

/** Resets inherited character styles on a freshly inserted paragraph. */
function styleParagraph_(paragraph, style) {
  paragraph.setHeading(DocumentApp.ParagraphHeading.NORMAL);

  const text = paragraph.editAsText();
  if (!text.getText().length) return;

  text.setStrikethrough(false);
  text.setUnderline(false);
  text.setBold(!!style.bold);
  text.setItalic(!!style.italic);
  if (style.color) text.setForegroundColor(style.color);
  if (style.size) text.setFontSize(style.size);
}
