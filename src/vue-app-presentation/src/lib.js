/**
 * Code which can shared in all parts of the app.
 * @file
 */

import marked from 'marked'

/**
 * @param {String} text - The raw input text coming directly form YAML
 *
 * @returns {String}
 */
function convertCustomMarkup (text) {
  return text
    // ↔	8596	2194	&harr;	LEFT RIGHT ARROW
    .replace(/<->/g, '↔')
    // →	8594	2192	&rarr;	RIGHTWARDS ARROW
    .replace(/->/g, '→')
    // ←	8592	2190	&larr;	LEFTWARDS ARROW
    .replace(/<-/g, '←')
}

/**
 * Maybe long texts are not converted? Had to use marked() function in editor.
 * Surpress wrapping in <p> tag.
 * Other no so stable solution: https://github.com/markedjs/marked/issues/395
 *
 * @param {String} text - The raw input text coming directly form YAML
 *
 * @returns {String}
 */
export function convertMarkdown (text) {
  text = marked(text)
  const dom = new DOMParser().parseFromString(text, 'text/html')
  if (dom.body.childElementCount === 1 && dom.body.childNodes[0].tagName === 'P') {
    return dom.body.childNodes[0].innerHTML
  } else {
    return dom.body.innerHTML
  }
}

/**
 * Wrapper function for various string convert functions
 *
 * @param {String} text - The raw input text coming directly form YAML
 *
 * @returns {String}
 */
function convert (text) {
  return convertMarkdown(convertCustomMarkup(text))
}

/**
 * Convert the specifed text to HTML. At the moment Markdown and HTML formats
 * are supported. The conversion is done in a recursive fashion, that means
 * nested strings are also converted.
 *
 * @param {String|Array|Object} input - Convert the specifed input.
 *
 * @returns {String}
 */
export function markupToHtml (input) {
  // string
  if (typeof input === 'string') {
    return convert(input)

  // array
  } else if (Array.isArray(input)) {
    for (let index = 0; index < input.length; index++) {
      const value = input[index]
      if (typeof value === 'string') {
        input[index] = convert(value)
      } else {
        markupToHtml(value)
      }
    }

  // object
  } else if (typeof input === 'object') {
    for (const key in input) {
      const value = input[key]
      if (typeof value === 'string') {
        input[key] = convert(value)
      } else {
        markupToHtml(value)
      }
    }
  }
  return input
}

/**
 * Check if the input is a valid URI. Prefix with `id:` if necassary
 *
 * @param {String} uri -  The URI to validate.
 *
 * @returns {ExecFileSyncOptionsWithStringEncoding}
 */
export function validateUri (uri) {
  if (typeof uri !== 'string') throw new Error(`”${uri}“ is not a string.`)
  const segments = uri.split(':')
  // To allow URI with out a URI scheme. This defaults to `id`.
  if (segments.length === 1) {
    uri = `id:${uri}`
  }
  return uri
}

/**
 * Set the display state on elements. Loop through all elements. On the first
 * step no elements are displayed. The number of steps is: number of elements
 * + 1.
 *
 * @param {Array} elements - A list of HTML elements to display on step number
 *   change.
 * @param {Number} stepNo - The current step number.
 */
export function displayElementByStepFull (elements, stepNo) {
  let count = 1
  for (const element of elements) {
    if (stepNo > count) {
      element.style.display = 'block'
    } else {
      element.style.display = 'none'
    }
    count += 1
  }
}

/**
 * Don’t loop through all elements. Update only the next element.
 *
 * @param {Array} elements - A list of HTML elements to display on step number
 *   change.
 * @param {Number} oldStepNo
 * @param {Number} newStepNo
 */
export function displayElementByStepMinimal (elements, oldStepNo, newStepNo) {
  if (newStepNo === 1 || (oldStepNo === 1 && newStepNo === elements.length + 1)) {
    displayElementByStepFull(elements, newStepNo)
    return
  }
  let element
  let display
  if (newStepNo > oldStepNo) {
    // First step: no elements are displayed
    element = elements[newStepNo - 2]
    display = 'block'
  } else {
    element = elements[newStepNo - 1]
    display = 'none'
  }
  element.style.display = display
}
