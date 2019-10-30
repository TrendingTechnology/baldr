/**
 * Code which can shared in all parts of the app.
 * @file
 */

import marked from 'marked'

/**
 * Convert the specifed text to HTML. At the moment Markdown and HTML formats
 * are supported. The conversion is done in a recursive fashion, that means
 * nested strings are also converted
 *
 * @param {String|Array|Object} input - Convert the specifed input.
 *
 * @returns {String}
 */
export function markupToHtml (input) {
  // Surpress wrapping in <p> tag.
  // https://github.com/markedjs/marked/issues/395
  function convertMarkdown(text) {
    return marked.inlineLexer(text, [])
  }

  // string
  if (typeof input === 'string') {
    return convertMarkdown(input)

  // array
  } else if (Array.isArray(input)) {
    for (let index = 0; index < input.length; index++) {
      const value = input[index]
      if (typeof value === 'string') {
        input[index] = convertMarkdown(value)
      } else {
        markupToHtml(value)
      }
    }

  // object
  } else if (typeof input === 'object') {
    for (const key in input) {
      const value = input[key]
      if (typeof value === 'string') {
        input[key] = convertMarkdown(value)
      } else {
        markupToHtml(value)
      }
    }
  }
  return input
}