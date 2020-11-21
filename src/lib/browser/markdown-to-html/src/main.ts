import * as marked from 'marked'
import { DOMParser } from 'xmldom'

/**
 * @param text - The raw input text coming directly form YAML
 */
function convertCustomMarkup (text: string): string {
  return text
    // ↔ 8596 2194 &harr; LEFT RIGHT ARROW
    .replace(/<->/g, '↔')
    // → 8594 2192 &rarr; RIGHTWARDS ARROW
    .replace(/->/g, '→')
    // ← 8592 2190 &larr; LEFTWARDS ARROW
    .replace(/<-/g, '←')
}

/**
 * Maybe long texts are not converted? Had to use marked() function in editor.
 * Surpress wrapping in <p> tag.
 * Other no so stable solution: https://github.com/markedjs/marked/issues/395
 *
 * @param text - The raw input text coming directly form YAML
 */
function convertMarkdown (text: string): string {
  text = marked(text)
  const dom = new DOMParser().parseFromString(text, 'text/html')
  if (dom.body.childElementCount !== undefined && dom.body.childElementCount === 1 && dom.body.childNodes[0].tagName === 'P') {
    return dom.body.childNodes[0].innerHTML
  } else {
    return dom.body.innerHTML
  }
}

/**
 * Convert a string from the Markdown format into the HTML format.
 *
 * @param text - A string in the Markdown format.
 */
export function convertMarkdownFromString (text: string): string {
  return convertMarkdown(convertCustomMarkup(text))
}

type Any = string | string[] | { [key: string]: Any }

/**
 * Convert the specifed text to HTML. At the moment Markdown and HTML formats
 * are supported. The conversion is done in a recursive fashion, that means
 * nested strings are also converted.
 *
 * @param input - Various input types
 */
export function convertMarkdownFromAny (input: Any): Any {
  // string
  if (typeof input === 'string') {
    return convertMarkdownFromString(input)

  // array
  } else if (Array.isArray(input)) {
    for (let index = 0; index < input.length; index++) {
      const value = input[index]
      if (typeof value === 'string') {
        input[index] = convertMarkdownFromString(value)
      } else {
        convertMarkdownFromAny(value)
      }
    }

  // object
  } else if (typeof input === 'object') {
    for (const key in input) {
      const value = input[key]
      if (typeof value === 'string') {
        input[key] = convertMarkdownFromString(value)
      } else {
        convertMarkdownFromAny(value)
      }
    }
  }
  return input
}
