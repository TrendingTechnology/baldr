/**
 * @module @bldr/lamp/steps
 */

/* globals DOMParser NodeList */

import vue from '@/main.js'
import { selectSubset } from '@bldr/core-browser'
import store from '@/store/index.js'

/**
 * Hold some meta data about a step of a slide. This class should not be
 * confused with the class `DomStepElement` which acts on the component level.
 */
class SlideStep {
  constructor ({ no, title, shortcut }) {
    /**
     * A number starting with 1.
     *
     * @type {Number}
     */
    this.no = no

    /**
     * Thie title of the step
     *
     * @type {String}
     */
    this.title = title

    /**
     * The shortcut to display the step.
     *
     * @type {String}
     */
    this.shortcut = shortcut
  }
}

/**
 * A wrapper class for a HTML element to be able to hide and show easily some
 * HTML elements.
 */
class DomStepElement {
  /**
   * @property {(Array|Object)} - Multiple HTML elements as an array or a
   *   single HTML element.
   * @property {Boolean} useVisibliltyProp - Set the visibility
   *   `element.style.visibility` instead of the display state.
   */
  constructor (elements, useVisibliltyProp = false) {
    /**
     * A HTML element.
     *
     * @type {Array}
     */
    this.htmlElements = null
    if (Array.isArray(elements)) {
      this.htmlElements = elements
    } else {
      this.htmlElements = [elements]
    }

    /**
     * @private
     */
    this.useVisibliltyProp_ = useVisibliltyProp

    if (this.useVisibliltyProp_) {
      this.stylePropertyName_ = 'visibility'
    } else {
      this.stylePropertyName_ = 'display'
    }

    /**
     * @private
     */
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
   * The last HTML element.
   *
   * @returns {String}
   */
  get htmlElement () {
    return this.htmlElements[this.htmlElements.length - 1]
  }

  /**
   * The text of last HTML element.
   *
   * @returns {String}
   */
  get text () {
    const lastElement = this.htmlElements[this.htmlElements.length - 1]
    return lastElement.textContent
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
    for (const element of this.htmlElements) {
      element.style[this.stylePropertyName_] = this.getStyleValue_(isVisible)
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
   * @property {HTMLElement} rootElement - A HTML element to run
   *   `querySelectorAll()` against.
   * @property {String} mode - Which specialized selector should
   *   be used. At the moment there are two: `words` or `sentences`.
   * @property {module:@bldr/core-browser~subsetSelector} subsetSelector
   * @property {String} useVisibliltyProp - default `false`
   * @property {Boolean} hideAllElementsInitally - default `true`
   */
  constructor (options) {
    const optionsDefault = {
      elements: null,
      cssSelectors: null,
      rootElement: null,
      mode: null,
      sentencesSelector: null,
      subsetSelector: null,
      useVisibliltyProp: false,
      hideAllElementsInitally: true
    }
    const opts = Object.assign(optionsDefault, options)

    /**
     * All elements obtained from `document.querySelectorAll()`.
     *
     * @type {module:@bldr/lamp/steps~DomStepElement[]}
     */
    this.elementsAll = []

    let elements

    if (!opts.rootElement) {
      opts.rootElement = document
    }

    if (opts.elements) {
      elements = opts.elements
    } else if (opts.mode) {
      if (opts.mode === 'words') {
        this.elementsAll = selectWords(opts.rootElement)
      } else if (opts.mode === 'sentences') {
        this.elementsAll = selectSentences(opts.rootElement)
      } else {
        throw new Error(`Unkown specialized selector: ${opts.mode}`)
      }
    } else if (opts.cssSelectors === 'none') {
      elements = []
    } else if (opts.cssSelectors) {
      elements = opts.rootElement.querySelectorAll(opts.cssSelectors)
    } else {
      throw new Error('Specify elements or cssSelectors')
    }

    if (elements) {
      for (const element of elements) {
        this.elementsAll.push(new DomStepElement(element, opts.useVisibliltyProp))
      }
    }

    /**
     * All elements or a subset of elements, if `subsetSelector` is specified.
     *
     * @type {module:@bldr/lamp/steps~DomStepElement[]}
     */
    this.elements = null
    if (opts.subsetSelector) {
      this.elements = selectSubset(opts.subsetSelector,
        { elements: this.elementsAll, shiftSelector: -1 }
      )
    } else {
      this.elements = this.elementsAll
    }

    if (opts.hideAllElementsInitally) {
      this.hideAll()
    }
  }

  /**
   * `elements` + 1
   *
   * @returns Number
   */
  get count () {
    return this.elements.length + 1
  }

  /**
   * `elementsAll` + 1
   *
   * @returns Number
   */
  get countAll () {
    return this.elementsAll.length + 1
  }

  /**
   * For debugging purposes.
   *
   * @returns {Array}
   */
  get htmlElements () {
    const htmlElements = []
    for (const domStep of this.elements) {
      const elements = domStep.htmlElements
      if (elements.length === 1) {
        htmlElements.push(elements[0])
      } else {
        htmlElements.push(elements)
      }
    }
    return htmlElements
  }

  /**
   * Hide all elements.
   */
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
   * @param {options}
   * @property {Number} oldStepNo - The previous step number.
   * @property {Number} stepNo - The current step number.
   * @property {Boolean} full - Perform a full update.
   *
   * @returns {Object} The element that is displayed by the new step number.
   */
  displayByNo ({ stepNo, oldStepNo, full }) {
    if (!this.elements || !this.elements.length) return
    // Loop through all elements. Set visibility state on all elements
    // Full update
    if (!oldStepNo || full || store.getters['lamp/nav/fullStepUpdate'] || stepNo === 1 || (oldStepNo === 1 && stepNo === this.count)) {
      let count = 1
      for (const domStep of this.elements) {
        const showElement = stepNo > count
        domStep.show(showElement)
        count += 1
      }
      if (stepNo === 1) {
        return this.elements[0].htmlElement
      }
      // First step: No elements are displayed.
      // The array index begins with 0, steps with 1.
      return this.elements[stepNo - 2].htmlElement
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
      return domStep.htmlElement
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
 * @returns {module:@bldr/lamp/steps~DomStepElement[]} An array of
 *   `DomStepElement`s.
 */
function selectWords (rootElement) {
  if (!rootElement) {
    rootElement = document
  }
  const wordsRaw = rootElement.querySelectorAll('span.word')
  const words = []
  for (const word of wordsRaw) {
    if (!word.previousSibling) {
      const parent = word.parentElement
      if (parent.tagName === 'LI') {
        if (!parent.previousSibling) {
          // <ul><li><span class="word">lol</span><li></ul>
          words.push(new DomStepElement([parent.parentElement, parent, word], true))
        } else {
          // Avoid to get divs. Parent has to be LI
          words.push(new DomStepElement([parent, word], true))
        }
      } else {
        words.push(new DomStepElement(word, true))
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
function selectSentences (rootElement) {
  const sentences = []
  for (const element of rootElement.children) {
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
 * @param {HTMLElement} parentElement
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
export function calculateStepCount (elements, props, shiftSelector = 0) {
  let count
  if (elements instanceof NodeList || Array.isArray(elements)) {
    count = elements.length
  } else {
    count = elements
  }
  if (props.stepSubset) {
    const elementsSubset = selectSubset(props.stepSubset, {
      elementsCount: count,
      shiftSelector
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
export function calculateStepCountText (text, props, shiftSelector = 0) {
  const dom = new DOMParser().parseFromString(text, 'text/html')

  let allElementsCount
  if (props.stepMode === 'words') {
    allElementsCount = countWords(dom)
  } else if (props.stepMode === 'sentences') {
    allElementsCount = countSentences(dom)
  }

  return calculateStepCount(allElementsCount, props, shiftSelector)
}

export function generateSlideStepsFromText (text, props) {
  const dom = new DOMParser().parseFromString(text, 'text/html')
  const options = {
    rootElement: dom
  }

  if (props.stepMode) {
    options.mode = props.stepMode
  }

  if (props.stepSubset) {
    options.subsetSelector = props.stepSubset
  }
  const domSteps = new DomSteps(options)
  const slideSteps = []
  for (let i = 0; i < domSteps.elements.length; i++) {
    const domStep = domSteps.elements[i]
    slideSteps.push(new SlideStep({ no: i + 2, title: domStep.text }))
  }
  return slideSteps
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
      description: 'Selektor, der Elemente auswählt, die als Schritte eingeblendet werden sollen. „none“ deaktiviert die Unterstützung für Schritte.',
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
  generateSlideStepsFromText,
  mapProps,
  wrapWords
}
