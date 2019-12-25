/**
 * Code which can shared in all parts of the app.
 * @file
 */

/* globals DOMParser */

import vue, { customStore } from '@/main.js'

import marked from 'marked'

/**
 * @param {String} text - The raw input text coming directly form YAML
 *
 * @returns {String}
 */
function convertCustomMarkup (text) {
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
 * Set the display / visiblilty state on elements. Loop through all elements or
 * perform a minimal update On the first step no elements are displayed.
 * The number of steps is: number of elements + 1.
 * Don’t loop through all elements. Update only the next element.
 *
 * @param {config}
 * @property {Array} elements - A list of HTML elements to display on step number
 *   change.
 * @property {Number} oldStepNo - The previous step number
 * @property {Number} stepNo - The current step number.
 * @property {Boolean} full - Performe a full update
 * @property {Boolean} visiblilty - Set the visibility `element.style.visibility`
 *   instead of the the display state.
 *
 * @returns {Object} The element that is displayed by the new step number.
 */
export function displayElementByStepNo ({ elements, stepNo, oldStepNo, full, visibility }) {

  function showElement(element, show) {
    if (visibility) {
      if (show) {
        element.style.visibility = 'visible'
      } else {
        element.style.visibility = 'hidden'
      }
    } else {
      if (show) {
        element.style.display = 'block'
      } else {
        element.style.display = 'none'
      }
    }
  }

  if (!oldStepNo || full || stepNo === 1 || (oldStepNo === 1 && stepNo === elements.length + 1)) {
    let count = 1
    for (const element of elements) {
      showElement(element, stepNo > count)
      count += 1
    }
    if (stepNo === 1) {
      return elements[0]
    }
    // First step: no elements are displayed
    // Array index begin with 0, steps with 1
    return elements[stepNo - 2]
  }
  let element
  if (stepNo > oldStepNo) {
    // First step: no elements are displayed
    // Array index begin with 0, steps with 1
    element = elements[stepNo - 2]
  } else {
    element = elements[stepNo - 1]
  }
  showElement(element, stepNo > oldStepNo)
  return element
}

/**
 * This object is mixed in into each master component.
 */
export const masterMixin = {
  mounted () {
    const oldSlide = vue.$store.getters['presentation/slideOld']
    let oldProps
    if (oldSlide) {
      oldProps = oldSlide.renderData.props
    }
    const newSlide = vue.$store.getters['presentation/slideCurrent']
    const newProps = newSlide.renderData.props
    newSlide.master.enterSlide({ oldSlide, oldProps, newSlide, newProps }, this)
    customStore.vueMasterInstanceCurrent = this
  },
  destroyed () {
    const oldSlide = vue.$store.getters['presentation/slideOld']
    let oldProps
    if (oldSlide) {
      oldProps = oldSlide.renderData.props
    }
    const newSlide = vue.$store.getters['presentation/slideCurrent']
    const newProps = newSlide.renderData.props
    newSlide.master.leaveSlide({ oldSlide, oldProps, newSlide, newProps }, this)
    customStore.vueMasterInstanceCurrent = null
  }
}

// https://stackoverflow.com/a/26030835
export function wrapWords (text) {
  if (Array.isArray(text)) {
    text = text.join(' ')
  }
  text = text.replace(/\n+/g, '')
  text = text.replace(/\s+/g, ' ')
  const dom = new DOMParser().parseFromString(text, 'text/html')
  // First a simple implementation of recursive descent,
  // visit all nodes in the DOM and process it with a callback:
  function walkDOM (node, callback) {
    if (node.nodeName !== 'SCRIPT') { // ignore javascript
      callback(node)
      for (let i = 0; i < node.childNodes.length; i++) {
        walkDOM(node.childNodes[i], callback)
      }
    }
  }

  const textNodes = []
  walkDOM(dom.body, function (n) {
    if (n.nodeType === 3) {
      textNodes.push(n)
    }
  })

  // simple utility functions to avoid a lot of typing:
  function insertBefore (new_element, element) {
    element.parentNode.insertBefore(new_element, element)
  }

  function removeElement (element) {
    element.parentNode.removeChild(element)
  }

  function makeSpan (txt) {
    const span = document.createElement('span')
    span.classList.add('word')
    span.appendChild(makeText(txt))
    return span
  }

  function makeText (txt) {
    return document.createTextNode(txt)
  }

  for (let i = 0; i < textNodes.length; i++) {
    const n = textNodes[i]
    const txt = n.nodeValue
    console.log(txt)
    const words = txt.split(' ')

    // Insert span surrounded words:
    insertBefore(makeSpan(words[0]), n)
    for (let j = 1; j < words.length; j++) {
      insertBefore(makeText(' '), n) // join the words with spaces
      insertBefore(makeSpan(words[j]), n)
    }
    // Now remove the original text node:
    removeElement(n)
  }
  const markup = dom.body.innerHTML
  return markup
}
