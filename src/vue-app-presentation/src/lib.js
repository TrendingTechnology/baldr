/**
 * Code which can shared in all parts of the app.
 *
 * @module @bldr/vue-app-presentation/lib
 */

/* globals DOMParser */

import marked from 'marked'
import vue from '@/main.js'

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
  function convertMarkdown (text) {
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
  function convertString (text) {
    return convertMarkdown(convertCustomMarkup(text))
  }

  // string
  if (typeof input === 'string') {
    return convertString(input)

  // array
  } else if (Array.isArray(input)) {
    for (let index = 0; index < input.length; index++) {
      const value = input[index]
      if (typeof value === 'string') {
        input[index] = convertString(value)
      } else {
        markupToHtml(value)
      }
    }

  // object
  } else if (typeof input === 'object') {
    for (const key in input) {
      const value = input[key]
      if (typeof value === 'string') {
        input[key] = convertString(value)
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
 * A wrapper class for a HTML element.
 */
class DomStepElement {
  /**
   *
   * @property {Boolean} useVisibliltyProp - Set the visibility `element.style.visibility`
   *   instead of the display state.
   */
  constructor (element, useVisibliltyProp = false) {
    this.element = element
    this.useVisibliltyProp_ = useVisibliltyProp

    if (this.useVisibliltyProp_) {
      this.stylePropertyName_ = 'visibility'
    } else {
      this.stylePropertyName_ = 'display'
    }

    this.styleValues_ = [
      {
        visibility: 'hidden',
        display: 'none'
      },
      {
        visibility: 'visible',
        display: 'block'
      }
    ]
  }

  /**
   * @private
   */
  getStyleValue_ (show) {
    return this.styleValues_[Number(show)][this.stylePropertyName_]
  }

  /**
   * @param {Boolean} isVisible
   */
  show (isVisible = true) {
    this.element.style[this.stylePropertyName_] = this.getStyleValue_(isVisible)
  }
}

/**
 * A group of step elements which are controlled at once.
 */
class DomStepElementGroup {
  /**
   *
   * @param {Array} elements
   */
  constructor (elements, useVisibliltyProp = false) {
    this.useVisibliltyProp_ = useVisibliltyProp
    /**
     * @type {Array}
     */
    this.elements = []
    if (elements) {
      this.addMultipleElements_(elements)
    }
  }

  /**
   *
   * @param {Array} elements
   *
   * @private
   */
  addMultipleElements_ (elements) {
    for (const element of elements) {
      this.addElement(element)
    }
  }

  /**
   *
   * @param {HTMLElement} element
   */
  addElement (element) {
    this.elements.push(new DomStepElement(element, this.useVisibliltyProp_))
  }

  /**
   * @param {Boolean} isVisible
   */
  show (isVisible = true) {
    for (const element of this.elements) {
      element.show(isVisible)
    }
  }
}

/**
 * Generate steps by hiding and showing some DOM elements.
 */
export class DomSteps {
  constructor (options) {
    const optionsDefault = {
      elements: null,
      cssSelectors: null,
      specializedSelector: null,
      sentencesSelector: null,
      subsetSelectors: null,
      useVisibliltyProp: false,
      hideAllElementsInitally: true
    }
    this.opts_ = Object.assign(optionsDefault, options)

    /**
     * All elements obtained from `document.querySelectorAll()`.
     *
     * @type {Array}
     */
    this.elementsAll = []

    let elements
    if (this.opts_.elements) {
      elements = this.opts_.elements
    } else if (this.opts_.specializedSelector) {
      if (this.opts_.specializedSelector === 'words') {
        this.elementsAll = DomSteps.selectWords()
      } else if (this.opts_.specializedSelector === 'sentences') {
        this.elementsAll = DomSteps.selectSentences(this.opts_.sentencesSelector)
      } else {
        throw new Error(`Unkown specialized selector: ${this.opts_.specializedSelector}`)
      }
    } else if (this.opts_.cssSelectors) {
      elements = document.querySelectorAll(this.opts_.cssSelectors)
    } else {
      throw new Error(`Specify elements or cssSelectors`)
    }

    if (this.elements) {
      for (const element of elements) {
        this.elementsAll.push(new DomStepElement(element, this.opts_.useVisibliltyProp))
      }
    }

    /**
     * All elements or a subset of elements, if `subsetSelectors` is specified.
     *
     * @type {Array}
     */
    this.elements = null
    if (this.opts_.subsetSelectors) {
      this.elements = this.selectElementsSubset_(this.opts_.subsetSelectors)
    } else {
      this.elements = this.elementsAll
    }

    if (this.opts_.hideAllElementsInitally) {
      this.hideAll()
    }
  }

  /**
   * Select words which are surrounded by `span.word`.
   *
   * @returns {DomStepElementGroup|DomStepElement[]} An array of
   *   `DomStepElement`s or `DomStepElementGroup`s.
   */
  static selectWords () {
    const wordsRaw = document.querySelectorAll('span.word')
    const words = []
    for (const word of wordsRaw) {
      if (!word.previousSibling) {
        const parent = word.parentElement
        if (parent.tagName === 'LI' && !parent.previousSibling) {
          words.push(new DomStepElementGroup([parent.parentElement, parent, word], true))
        } else {
          words.push(new DomStepElementGroup([parent, word], true))
        }
      } else {
        words.push(new DomStepElement(word, true))
      }
    }
    return words
  }

  /**
   * Select more than a word. The meaning  of "sentences" in the function name
   * should not be understood literally, but symbolic for a longer text unit.
   * Select a whole paragraph (`<p>`) or a heading `<h1>` or `<li>` items of
   * ordered or unordered lists, or a table row.
   *
   * @param {String} - A selector for `document.querySelector()` of the parent
   *   Element, which contains child HTML element to use as steps.
   *
   * @returns {DomStepElement[]} An array of
   *   `DomStepElement`s.
   */
  static selectSentences (selector) {
    const parentElement = document.querySelector(selector)
    const sentences = []
    for (const element of parentElement.children) {
      if (['UL', 'OL'].includes(element.tagName)) {
        for (const li of element.children) {
          if (li.tagName === 'LI') {
            sentences.push(new DomStepElement(li, true))
          }
        }
      } else {
        sentences.push(new DomStepElement(element, true))
      }
    }
    return sentences
  }

  /**
   * Map step support related props for the use as Vuejs props.
   *
   * @param {Array} selector
   *
   * @returns {Object}
   */
  static mapProps (selectors) {
    const props = {
      // stepSelector: {
      //   default: 'g',
      // },
      words: {
        type: Boolean,
        description: 'Text ausblenden und einzelne Wörtern einblenden',
        default: false
      },
      sentences: {
        type: Boolean,
        description: 'Text ausblenden und einzelne Sätze (im übertragenem Sinn) einblenden.',
        default: false
      },
      subset: {
        type: String,
        description: 'Eine Untermenge von Schritten auswählen (z. B. 1,3,5 oder 2-5).'
      }
    }

    const result = {}
    for (const selector of selectors) {
      if (props[selector]) {
        result[`step${selector.charAt(0).toUpperCase()}${selector.substr(1).toLowerCase()}`] = props[selector]
      }
    }
    return result
  }

  /**
   * @param {String} subsetSelectors
   *
   * @private
   */
  selectElementsSubset_ (subsetSelectors) {
    const subset = {}
    // 2, 3, 5 -> 2,3,5
    subsetSelectors = subsetSelectors.replace(/\s*/g, '')
    // 2-3,5-7
    const ranges = subsetSelectors.split(',')

    for (let range of ranges) {
      // -7 -> 2-7
      if (range.match(/^-/)) {
        range = `2${range}`
      }

      // 7- -> 7-23
      if (range.match(/-$/)) {
        range = `${range}${this.countAll}`
      }

      range = range.split('-')
      if (range.length === 1) {
        const stepNo = range[0]
        subset[stepNo] = this.elementsAll[stepNo - 2]
      } else if (range.length === 2) {
        const beginNo = parseInt(range[0])
        const endNo = parseInt(range[1])
        for (let stepNo = beginNo; stepNo <= endNo; stepNo++) {
          subset[stepNo] = this.elementsAll[stepNo - 2]
        }
      }
    }

    // Sort the steps by the step number.
    const stepNos = Object.keys(subset)
    stepNos.sort((a, b) => a - b) // For ascending sort
    const result = []
    for (const stepNo of stepNos) {
      result.push(subset[stepNo])
    }
    return result
  }

  get count () {
    return this.elements.length + 1
  }

  get countAll () {
    return this.elementsAll.length + 1
  }

  hideAll () {
    for (const element of this.elementsAll) {
      element.show(false)
    }
  }

  /**
   * Set the display / visiblilty state on HTML elements. Loop through all
   * elements or perform a minimal update. On the first step no elements are
   * displayed. The number of steps is: number of elements + 1.
   * A minimal update doesn’t loop through all elements, only the visibility
   * state of the next element is changed.
   *
   * @param {config}
   * @property {Number} oldStepNo - The previous step number.
   * @property {Number} stepNo - The current step number.
   * @property {Boolean} full - Perform a full update.
   *
   * @returns {Object} The element that is displayed by the new step number.
   */
  displayByNo ({ stepNo, oldStepNo, full }) {
    if (!oldStepNo || full || stepNo === 1 || (oldStepNo === 1 && stepNo === this.count)) {
      let count = 1
      for (const domStep of this.elements) {
        domStep.show(stepNo > count)
        count += 1
      }
      if (stepNo === 1) {
        return this.elements[0].element
      }
      // First step: No elements are displayed.
      // The array index begins with 0, steps with 1.
      return this.elements[stepNo - 2].element
    }
    let domStep
    if (stepNo > oldStepNo) {
      // First step: No elements are displayed.
      // The array index begins with 0, steps with 1.
      domStep = this.elements[stepNo - 2]
    } else {
      domStep = this.elements[stepNo - 1]
    }
    domStep.show(stepNo > oldStepNo)
    return domStep.element
  }
}

/**
 * Functions and configuration data for masters with step support.
 */
export const stepSupport = {
  props: {
    // stepSelector: {
    //   default: 'g',
    // },
    stepWords: {
      type: Boolean,
      description: 'Text ausblenden und einzelne Wörtern einblenden',
      default: false
    },
    stepSentences: {
      type: Boolean,
      description: 'Text ausblenden und einzelne Sätze (im übertragenem Sinn) einblenden.',
      default: false
    },
    stepSubset: {
      type: String,
      description: 'Eine Untermenge von Schritten auswählen (z. B. 1,3,5 oder 2-5).'
    },
    stepExclude: {
      type: [Array, Number],
      description: 'Schritt-Number der Elemente, die nicht als Schritte eingeblendet werden sollen. (z. B. 1, oder [1, 2, 3])'
    },
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
   * TODO: remove
   *
   * Return a subset of HTML elements, which are used as steps.
   *
   * @param {Array} elements - An array of HTML elements or a node list of
   *   elements.
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
   * TODO: remove
   *
   * Remove some element from the step nodelist. The node list is
   * converted into a array.
   *
   * @param {Array} elements - An array of HTML elements or a node list of
   *   elements.
   * @param {Array|Number} exclude - An array of element numbers to exclude
   *   that means delete from the elements array.
   *
   * @returns {Array}
   */
  excludeElements: function (elements, exclude) {
    if (!exclude) return elements

    if (typeof exclude === 'number') {
      exclude = [exclude]
    }

    // Sort exclude numbers descending
    elements = [...elements]
    exclude.sort((a, b) => b - a)
    for (const stepNo of exclude) {
      elements.splice(stepNo - 1, 1)
    }
    return elements
  },

  /**
   * TODO: Implement vuex support
   *
   * @param {Array} elements - An array of HTML elements or a node list of
   *   elements.
   */
  shortcutsRegister: function (elements) {
    for (const element of elements) {
      const shortcut = element.getAttribute('baldr-shortcut')
      const description = element.getAttribute('inkscape:label')
      vue.$shortcuts.add(`q ${shortcut}`, () => {
        element.style.display = 'block'
      }, `${description} (einblenden in SVG: „${this.svgTitle}“)`)
    }
  },

  /**
   *
   * @param {Array} elements - An array of HTML elements or a node list of
   *   elements.
   */
  shortcutsUnregister: function (elements) {
    if (!elements) return
    for (const element of elements) {
      const shortcut = element.getAttribute('baldr-shortcut')
      vue.$shortcuts.remove(`q ${shortcut}`)
    }
  },

  selectWords: function () {
    const wordsRaw = document.querySelectorAll('span.word')
    const words = []
    for (const word of wordsRaw) {
      if (!word.previousSibling) {
        const parent = word.parentElement
        if (parent.tagName === 'LI' && !parent.previousSibling) {
          words.push([parent.parentElement, parent, word])
        } else {
          words.push([parent, word])
        }
      } else {
        words.push(word)
      }
    }
    return words
  },

  /**
   * Select more than a word. The meaning  of "sentences" in the function name
   * should not be understood literally, but symbolic for a longer text unit.
   * Select a whole paragraph (`<p>`) or a heading `<h1>` or `<li>` items of
   * ordered or unordered lists, or a table row.
   *
   * @param {String} - A selector for `document.querySelector()` of the parent
   *   Element, which contains child HTML element to use as steps.
   *
   * @return {Array} - An array of HTML elements.
   */
  selectSentences: function (selector) {
    const parentElement = document.querySelector(selector)
    const sentences = []
    for (const element of parentElement.children) {
      if (['UL', 'OL'].includes(element.tagName)) {
        for (const li of element.children) {
          if (li.tagName === 'LI') {
            sentences.push(li)
          }
        }
      } else {
        sentences.push(element)
      }
    }
    return sentences
  },

  /**
   * Set the display / visiblilty state on HTML elements. Loop through all
   * elements or perform a minimal update. On the first step no elements are
   * displayed. The number of steps is: number of elements + 1.
   * A minimal update doesn’t loop through all elements, only the visibility
   * state of the next element is changed.
   *
   * @param {config}
   * @property {Array} elements - A list of HTML elements to display on step number
   *   change.
   * @property {Number} oldStepNo - The previous step number.
   * @property {Number} stepNo - The current step number.
   * @property {Boolean} full - Perform a full update.
   * @property {Boolean} visiblilty - Set the visibility `element.style.visibility`
   *   instead of the display state.
   *
   * @returns {Object} The element that is displayed by the new step number.
   */
  displayElementByNo: function ({ elements, stepNo, oldStepNo, full, visibility }) {
    /**
     *
     * @param {Mixed} element - One HTML element or a array of HTML elements
     * @param {Boolean} show
     */
    function showElement (element, show) {
      const styleValues = [
        {
          visibility: 'hidden',
          display: 'none'
        },
        {
          visibility: 'visible',
          display: 'block'
        }
      ]
      let stylePropertyName
      if (visibility) {
        stylePropertyName = 'visibility'
      } else {
        stylePropertyName = 'display'
      }
      const styleValue = styleValues[Number(show)][stylePropertyName]
      if (Array.isArray(element)) {
        for (const subElement of element) {
          subElement.style[stylePropertyName] = styleValue
        }
      } else {
        element.style[stylePropertyName] = styleValue
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
  vue.$media.player.stop()
  vue.$store.dispatch('media/clear')
  await vue.$store.dispatch('presentation/openPresentationById', presentationId)
  if (vue.$route.name !== 'slides-preview') {
    vue.$router.push({ name: 'slides-preview' })
  }
}

export async function openPresentationByRawYaml (rawYamlString) {
  vue.$media.player.stop()
  vue.$store.dispatch('media/clear')
  await vue.$store.dispatch('presentation/openPresentation', { rawYamlString })
  if (vue.$route.name !== 'slides') {
    vue.$router.push({ name: 'slides' })
  }
}

/**
 * Grab / select values from two objects. The first object is preferred. The
 * first object can be for example props and the second a object from the media
 * server.
 */
export class GrabFromObjects {
  /**
   * @param {Object} object1
   * @param {Object} object2
   * @param {Boolean} markup - Apply `markupToHtml()` to the values of the
   *   second object.
   */
  constructor (object1, object2, markup = true) {
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
  property (property) {
    if (this.object1[property]) return this.object1[property]
    if (this.object2[property]) {
      if (this.markup) {
        return markupToHtml(this.object2[property])
      } else {
        return this.object2[property]
      }
    }
  }

  /**
   * Grab multiple properties.
   *
   * @param {Array} properties - An array of property names.
   *
   * @returns {object} - A new object containing the key and value pairs.
   */
  multipleProperties (properties) {
    const result = {}
    for (const property of properties) {
      const value = this.property(property)
      if (value) result[property] = value
    }
    return result
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
