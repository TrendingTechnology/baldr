/**
 * Code which can shared in all parts of the app.
 * @file
 */

/* globals DOMParser */

import marked from 'marked'
import vue from '@/main.js'

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
 * Check if the input is a valid URI. Prefix with `id:` if necessary.
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
 * Functions and configuration data for masters with step support.
 */
export const stepSupport = {
  props: {
    // stepSelector: {
    //   default: 'g',
    // },
    // stepExclude: {
    //   type: [Array, Number]
    // },
    stepBegin: {
      type: Number,
      description: 'Blende ab dieser Number die Schritte ein.'
    },
    stepEnd: {
      type: Number,
      description: 'Blende bis zu dieser Number die Schritte ein.'
    }
  },

  /**
   * Return a subset of HTML elements, which are used as steps.
   *
   * @param {Array} elements
   * @param {Object} options
   *
   * @param {Array}
   */
  limitElements: function (elements, { stepBegin, stepEnd }) {
    // Elements returned from document.querySelector are no arrays.
    // Convert to arrays.
    elements = [...elements]
    let begin = 0
    if (stepBegin && stepBegin > 1) {
      begin = stepBegin - 2
    }
    let end = elements.length - 1
    if (stepEnd && stepEnd > 1) {
      end = stepEnd - 2
    }
    return elements.splice(begin, end - begin + 1)
  },

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
   * @property {Boolean} full - Perform a full update.
   * @property {Boolean} visiblilty - Set the visibility `element.style.visibility`
   *   instead of the the display state.
   *
   * @returns {Object} The element that is displayed by the new step number.
   */
  displayElementByNo: function ({ elements, stepNo, oldStepNo, full, visibility }) {

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
      // First step: No elements are displayed.
      // The array index begins with 0, steps with 1.
      return elements[stepNo - 2]
    }
    let element
    if (stepNo > oldStepNo) {
      // First step: No elements are displayed.
      // The array index begins with 0, steps with 1.
      element = elements[stepNo - 2]
    } else {
      element = elements[stepNo - 1]
    }
    showElement(element, stepNo > oldStepNo)
    return element
  }
}

/**
 * Wrap each word in a string into `<span class="word">…</span>`
 *
 * @param {String} text - A string
 *
 * @see {@link https://stackoverflow.com/a/26030835}
 *
 * @returns {String}
 */
export function wrapWords (text) {
  if (Array.isArray(text)) {
    text = text.join(' ')
  }
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

  /**
   * Add a HTML element before the other element. Simple utility functions to
   * avoid a lot of typing.
   *
   * @param {HtmlElement} newElement
   * @param {HtmlElement} element
   */
  function insertBefore (newElement, element) {
    element.parentNode.insertBefore(newElement, element)
  }

  /**
   * Remote a HTML element.
   *
   * @param {HtmlElement} element
   */
  function removeElement (element) {
    element.parentNode.removeChild(element)
  }

  /**
   * Wrap a text string with `<span class="word">…</span>`
   *
   * @param {String} txt
   *
   * @returns {HTMLElement}
   */
  function makeSpan (txt) {
    const span = document.createElement('span')
    span.classList.add('word')
    span.appendChild(makeText(txt))
    return span
  }

  /**
   * Convert a text string into a text node.
   *
   * @param {String} txt
   *
   * @returns {TextNode}
   */
  function makeText (txt) {
    return document.createTextNode(txt)
  }

  for (let i = 0; i < textNodes.length; i++) {
    const node = textNodes[i]
    const txt = node.nodeValue
    // A avoid spaces surrounded by <span class="word"></span>
    if (txt !== ' ') {
      const words = txt.split(' ')
      // Insert span surrounded words:
      insertBefore(makeSpan(words[0]), node)
      for (let j = 1; j < words.length; j++) {
        // Join the words with spaces.
        insertBefore(makeText(' '), node)
        insertBefore(makeSpan(words[j]), node)
      }
      // Now remove the original text node:
      removeElement(node)
    }
  }
  return dom.body.innerHTML
}

export async function openPresentation (presentationId) {
  vue.$store.dispatch('media/clear')
  await vue.$store.dispatch('presentation/openPresentationById', presentationId)
  if (vue.$route.name !== 'slides-preview') {
    vue.$router.push({ name: 'slides-preview' })
  }
}

/**
 * Grab / select value from two objects. The first object is preferred.
 */
export class GrabFromObjects {
  /**
   * @param {Object} object1
   * @param {Object} object2
   * @param {Boolean} markup - Apply `markupToHtml()` to the value of the
   *   second object
   */
  constructor (object1, object2, markup=true) {
    this.object1 = object1
    this.object2 = object2
    this.markup = markup
  }

  /**
   * Grab a value from two objects.
   *
   * @param {String} property - The name of property to look for
   * @returns {Mixed}
   */
  property(property) {
    if (this.object1[property]) return this.object1[property]
    if (this.object2[property]) {
      if (this.markup) {
        return markupToHtml(this.object2[property])
      } else {
        return this.object2[property]
      }
    }
  }
}

/**
 * Search for SVG files in the HTML tree and warn if there are width and
 * height attributes set. With width and height attributes SVGs could
 * not resized easily in IMG tags. The slide preview depends on resizeable
 * SVGs.
 *
 * @param {string} filePath - Path of the SVG. Only need for better error
 *   messages.
 */
export function warnSvgWidthHeight (filePath) {
  const svgs = document.querySelectorAll('svg')
  for (const svg of svgs) {
    if (svg.attributes.height || svg.attributes.width) {
      if (filePath) filePath = ` (${filePath})`
      vue.$notifyError(`SVG file${filePath} has width and height attributes set.`)
    }
  }
}
