/**
 * Code which can shared in all parts of the app.
 *
 * @module @bldr/lamp/lib
 */

/* globals DOMParser */

import marked from 'marked'
import vue from '@/main.js'
import { selectSubset } from '@bldr/core-browser'

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
   * For the scroll function: to get every time a HTML element.
   */
  get element () {
    return this.elements[0].element
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
  /**
   *
   * @param {Object} options
   * @property {Array} elements - An array of HTML elements to use as steps.
   * @property {String} cssSelectors - String to feed
   *   `document.querySelectorAll()`
   * @property {String} specializedSelector - Which specialized selector should
   *   be used. At the moment there are two: `words` or `sentences`.
   * @property {String} sentencesSelector - A CSS selector which is passed
   *   through to the static method `DomSteps.selectSentences`, which uses
   *   `document.querySelector()` to find the parent HTML element, which
   *   contains child HTML element to use as steps.
   * @property {String} subsetSelectors
   * @property {String} useVisibliltyProp - default `false`
   * @property {Boolean} hideAllElementsInitally - default `true`
   */
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

    if (elements) {
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
      this.elements = selectSubset(this.opts_.subsetSelectors,
        { elements: this.elementsAll, shiftSelector: -1 }
      )
    } else {
      this.elements = this.elementsAll
    }

    if (this.opts_.hideAllElementsInitally) {
      this.hideAll()
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
  static wrapWords (text) {
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

  static countWords (dom) {
    return dom.querySelectorAll('span.word').length
  }

  /**
   * Select more than a word. The meaning  of "sentences" in the function name
   * should not be understood literally, but symbolic for a longer text unit.
   * Select a whole paragraph (`<p>`) or a heading `<h1>` or `<li>` items of
   * ordered or unordered lists, or a table row.
   *
   * @param {String} - A selector for `document.querySelector()` to find the
   *   parent HTML element, which contains child HTML element to use as steps.
   *
   * @returns {DomStepElement[]} An array of `DomStepElement`s.
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

  static countSentences (parentElement) {
    let count = 0
    for (const element of parentElement.children) {
      if (['UL', 'OL'].includes(element.tagName)) {
        for (const li of element.children) {
          if (li.tagName === 'LI') {
            count++
          }
        }
      } else {
        count++
      }
    }
    return count
  }

  /**
   * @param {Objects} props - An object to search for the properties `stepWords`
   *   or `stepSentences`.
   *
   * @returns {String} - `words` or `sentences`
   */
  static getSpecializedSelectorsFromProps (props) {
    if (props.stepWords) {
      return 'words'
    } else if (props.stepSentences) {
      return 'sentences'
    }
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
      selector: {
        description: 'Selektor, der Elemente auswählt, die als Schritte eingeblendet werden sollen.',
        default: 'g[inkscape\\:groupmode="layer"]'
      },
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

  setStepCount (slide) {
    slide.stepCount = this.count
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
    // Loop through all elements. Set visibility state on all elements
    // Full update
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
    // Todo: displayByNo is called twice, Fix this.
    if (domStep) {
      domStep.show(stepNo > oldStepNo)
      return domStep.element
    } else {
      // setStepLastOrFirstByDirection
      console.log(`TODO remove this call: count ${this.count} stepNo ${stepNo} oldStepNo ${oldStepNo} full ${full}`)
    }
  }

  /**
   * TODO: Implement vuex support
   *
   * @param {Array} elements - An array of HTML elements or a node list of
   *   elements.
   */
  shortcutsRegister () {
    for (const element of this.elements) {
      const shortcut = element.element.getAttribute('baldr-shortcut')
      const description = element.element.getAttribute('inkscape:label')
      vue.$shortcuts.add(`q ${shortcut}`, () => {
        element.show(true)
      }, `${description} (einblenden in SVG: „${this.svgTitle}“)`)
    }
  }

  /**
   *
   * @param {Array} elements - An array of HTML elements or a node list of
   *   elements.
   */
  shortcutsUnregister () {
    if (!this.elements) return
    for (const element of this.elements) {
      const shortcut = element.element.getAttribute('baldr-shortcut')
      vue.$shortcuts.remove(`q ${shortcut}`)
    }
  }
}

/**
 * Open a presentation by a its ID.
 *
 * @param {String} presId
 */
export async function openPresentationById (presId) {
  vue.$media.player.stop()
  vue.$store.dispatch('media/clear')
  await vue.$store.dispatch('presentation/openPresentationById', presId)
}

/**
 * Open a presentation and redirect to the desired view, stop the player and
 * clear the media cache.
 *
 * @param {String} presId
 * @param {Number} slideNo
 * @param {Number} stepNo
 */
export async function openPresentation (args) {
  if (typeof args === 'string') {
    args = { presId: args }
  }

  vue.$media.player.stop()
  vue.$store.dispatch('media/clear')
  await vue.$store.dispatch('presentation/openPresentationById', args.presId)
  vue.$store.dispatch('presentation/setSlideAndStepNoCurrent', args)

  if (args.noRouting) return
  if (args.route) {
    vue.$router.push(args.route)
  } else if (args.slideNo && args.slideNo > 1 && vue.$route.name !== 'slides') {
    vue.$router.push({ name: 'slides' })
  } else if (vue.$route.name !== 'slides-preview') {
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
