/**
 * @module @bldr/lamp/steps
 */

import vue from '@/main.js'
import { selectSubset } from '@bldr/core-browser'

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
   * @property {String} mode - Which specialized selector should
   *   be used. At the moment there are two: `words` or `sentences`.
   * @property {String} sentencesSelector - A CSS selector which is passed
   *   through to the function `selectSentences`, which uses
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
      mode: null,
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
    } else if (this.opts_.mode) {
      if (this.opts_.mode === 'words') {
        this.elementsAll = selectWords()
      } else if (this.opts_.mode === 'sentences') {
        this.elementsAll = selectSentences(this.opts_.sentencesSelector)
      } else {
        throw new Error(`Unkown specialized selector: ${this.opts_.mode}`)
      }
    } else if (this.opts_.cssSelectors) {
      elements = document.querySelectorAll(this.opts_.cssSelectors)
    } else {
      throw new Error('Specify elements or cssSelectors')
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
   * @param {@bldr/lamp/content-file~Slide } slide
   */
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
    }
    // setStepLastOrFirstByDirection
    // console.log(`TODO remove this call: count ${this.count} stepNo ${stepNo} oldStepNo ${oldStepNo} full ${full}`)
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

/**
 * Select words which are surrounded by `span.word`.
 *
 * @returns {DomStepElementGroup|DomStepElement[]} An array of
 *   `DomStepElement`s or `DomStepElementGroup`s.
 */
function selectWords () {
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
 *
 * @param {*} dom
 */
function countWords (dom) {
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
function selectSentences (selector) {
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
 *
 * @param {*} parentElement
 *
 * @returns {Number}
 */
function countSentences (parentElement) {
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
 * Assumes that all elements are hidden for the first step.
 *
 * @param {(Array|Number)} elements - An array of elements or the count of
 *   the elements.
 * @param {Object} props
 * @property {String} stepSubset
 *
 * @returns {Number}
 */
export function calculateStepCount (elements, props) {
  let count
  if (Array.isArray(elements)) {
    count = elements.length
  } else {
    count = elements
  }
  if (props.stepSubset) {
    const elementsSubset = selectSubset(props.stepSubset, {
      elementsCount: count
    })
    return elementsSubset.length + 1
  } else {
    return count + 1
  }
}

/**
 * Pre calculate the step count of a text.
 *
 * @param {String} text
 * @param {Object} props
 * @property {String} stepMode
 * @property {String} stepSubset
 *
 * @returns {Number}
 */
export function calculateStepCountText (text, props) {
  const dom = new DOMParser().parseFromString(text, 'text/html')

  let allElementsCount
  if (props.stepMode === 'words') {
    allElementsCount = countWords(dom)
  } else if (props.stepMode === 'sentences') {
    allElementsCount = countSentences(dom)
  }

  return calculateStepCount(allElementsCount, props)
}

/**
 * Map step support related props for the use as Vuejs props.
 *
 * @param {Array} selectors - At the moment: “selector”, “mode” and “subset”.
 *
 * @returns {Object}
 */
export function mapProps (selectors) {
  const props = {
    selector: {
      description: 'Selektor, der Elemente auswählt, die als Schritte eingeblendet werden sollen.',
      default: 'g[inkscape\\:groupmode="layer"]'
    },
    mode: {
      type: String,
      description: '„words“ oder „sentences“'
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

export default {
  calculateStepCount,
  calculateStepCountText,
  DomSteps,
  mapProps,
  wrapWords
}
