import * as marked from 'marked'

// Do not remove this lines. The comments are removed by the build script.
// <- const { JSDOM } = require('jsdom')
// <- const DOMParser = new JSDOM().window.DOMParser

/**
 * Convert some custom markup like arrows.
 *
 * @param text - The raw input text coming directly form YAML.
 */
function convertCustomMarkup (text: string): string {
  return (
    text
      // ↔ 8596 2194 &harr; LEFT RIGHT ARROW
      .replace(/<->/g, '↔')
      // → 8594 2192 &rarr; RIGHTWARDS ARROW
      .replace(/->/g, '→')
      // ← 8592 2190 &larr; LEFTWARDS ARROW
      .replace(/<-/g, '←')
  )
}

/**
 * Convert a string from Markdown to HTML. Automatically generate a
 * inline version (without surrounding `<p></p>`) if the text consists
 * of only one paragraph.
 *
 * Other no so stable solution:
 * https://github.com/markedjs/marked/issues/395
 *
 * @param text - The raw input text coming directly from YAML.
 */
function convertMarkdownAutoInline (text: string): string {
  text = marked(text)
  const dom = new DOMParser().parseFromString(text, 'text/html')
  // Solution using the browser only implementation.
  if (
    dom.body.childElementCount === 1 &&
    dom.body.children[0].tagName === 'P'
  ) {
    return dom.body.children[0].innerHTML
  } else {
    return dom.body.innerHTML
  }
}

/**
 * Convert a string from the Markdown format into the HTML format.
 *
 * @param text - A string in the Markdown format.
 */
export function convertMarkdownStringToHtml (text: string): string {
  return convertMarkdownAutoInline(convertCustomMarkup(text))
}

type Any = string | string[] | { [key: string]: Any }

/**
 * Convert Markdown texts into HTML texts.
 *
 * The conversion is done in a recursive fashion, that means
 * strings nested in objects or arrays are also converted.
 *
 * @param input - Various input types
 */
export function convertMarkdownToHtml (input: Any): Any {
  // string
  if (typeof input === 'string') {
    return convertMarkdownStringToHtml(input)

    // array
  } else if (Array.isArray(input)) {
    for (let index = 0; index < input.length; index++) {
      const value = input[index]
      if (typeof value === 'string') {
        input[index] = convertMarkdownStringToHtml(value)
      } else {
        convertMarkdownToHtml(value)
      }
    }

    // object
  } else if (typeof input === 'object') {
    for (const key in input) {
      const value = input[key]
      if (typeof value === 'string') {
        input[key] = convertMarkdownStringToHtml(value)
      } else {
        convertMarkdownToHtml(value)
      }
    }
  }
  return input
}
