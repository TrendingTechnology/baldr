/**
 * Code which can shared in all parts of the app.
 * @file
 */

import marked from 'marked'


/**
 * @param {String} text - Convert the specifed text to HTML. At the momenent
 *   Markdown and HTML formats are supported.
 */
export function markupToHtml (text) {
  return marked(text)
}