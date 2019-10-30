/**
 * Code which can shared in all parts of the app.
 * @file
 */

import marked from 'marked'

/**
 * Convert the specifed text to HTML. At the moment Markdown and HTML formats
 * are supported.
 *
 * @param {String} text - Convert the specifed text to HTML. At the momenent
 *   Markdown and HTML formats are supported.
 *
 * @returns {String}
 */
export function markupToHtml (text) {
  // Surpress wrapping in <p> tag.
  // https://github.com/markedjs/marked/issues/395
  return marked.inlineLexer(text, [])
}