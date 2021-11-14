/**
 * @module @bldr/lamp/steps
 */

/* globals DOMParser NodeList */

import vue from '@/main'
import { selectSubset, buildSubsetIndexes } from '@bldr/core-browser'
import store from '@/store/index.js'

const vm = vue as any

/**
 * Hold some meta data about a step of a slide. This class should not be
 * confused with the class `DomStepElement` which acts on the component level.
 */
interface SlideStepSpec {
  /**
   * A number starting with 1.
   */
  no?: number

  /**
   * Thie title of the step
   */
  title?: string

  /**
   * The shortcut to display the step.
   */
  shortcut?: string
}

/**
 * @TODO remove use interface only
 */
class SlideStep implements SlideStepSpec {
  no?: number
  title?: string
  shortcut?: string
  constructor ({ no, title, shortcut }: SlideStepSpec) {
    this.no = no
    this.title = title
    this.shortcut = shortcut
  }
}

type HTMLOrSVGElement = SVGElement | HTMLElement

/**
 * A wrapper class for a HTML element to be able to hide and show easily some
 * HTML elements.
 */
class DomStepElement {
  htmlElements: HTMLOrSVGElement[]
  private readonly useVisiblilty: boolean

  /**
   * @property Multiple HTML elements as an array or a
   *   single HTML element.
   * @property useVisiblilty - Set the visibility
   *   `element.style.visibility` instead of the display state.
   */
  constructor (
    elements: HTMLOrSVGElement[] | HTMLOrSVGElement,
    useVisiblilty: boolean = false
  ) {
    if (Array.isArray(elements)) {
      this.htmlElements = elements
    } else {
      this.htmlElements = [elements]
    }

    this.useVisiblilty = useVisiblilty
  }

  /**
   * The last HTML element.
   */
  get htmlElement (): HTMLOrSVGElement {
    return this.htmlElements[this.htmlElements.length - 1]
  }

  get text (): string | undefined {
    if (this.htmlElement.textContent != null) {
      return this.htmlElement.textContent
    }
  }

  public setState (isVisible: boolean): void {
    for (const element of this.htmlElements) {
      if (isVisible) {
        if (this.useVisiblilty) {
          element.style.visibility = 'visible'
        } else {
          element.style.display = 'block'
        }
      } else {
        if (this.useVisiblilty) {
          element.style.visibility = 'hidden'
        } else {
          element.style.display = 'none'
        }
      }
    }
  }

  public show () {
    this.setState(true)
  }

  public hide () {
    this.setState(false)
  }
}

interface DomStepOptions {
  /**
   * An array of HTML elements to use as steps.
   */
  elements?: any[]

  /**
   * String to feed `document.querySelectorAll()`
   */
  cssSelectors?: string

  /**
   * A HTML element to run `querySelectorAll()` against.
   */
  rootElement?: HTMLElement

  /**
   * Which specialized selector should be used. At the moment there are two:
   * `words` or `sentences`.
   */
  mode?: 'words' | 'sentences'

  sentencesSelector?: null

  subsetSelector?: string

  /**
   * default `false`
   */
  useVisibliltyProp?: boolean

  /**
   * default `true`
   */
  hideAllElementsInitally?: boolean
}

interface DisplayOptions {
  /**
   * the previous step number.
   */
  oldStepNo?: number

  /**
   * The current step number.
   */
  stepNo: number

  /**
   *  Perform a full update.
   */
  full?: boolean
}

/**
 * Generate steps by hiding and showing some DOM elements.
 */
export class DomStepController {
  /**
   * All elements obtained from `document.querySelectorAll()`.
   */
  elementsAll: DomStepElement[]

  /**
   * All elements or a subset of elements, if `subsetSelector` is specified.
   */
  elements: DomStepElement[]

  constructor (options: DomStepOptions) {
    const optionsDefault: DomStepOptions = {
      useVisibliltyProp: false,
      hideAllElementsInitally: true
    }
    const opts = Object.assign(optionsDefault, options)

    this.elementsAll = this.collectAllElements(opts)

    this.elements = this.collectSubsetElements(
      this.elementsAll,
      opts.subsetSelector
    )

    if (opts.hideAllElementsInitally != null && opts.hideAllElementsInitally) {
      this.hideAll()
    }
  }

  private collectAllElements (opts: DomStepOptions): DomStepElement[] {
    if (opts.rootElement == null) {
      const d = document as unknown
      opts.rootElement = d as HTMLElement
    }

    if (opts.mode != null) {
      return this.applySpecializedSelectors(opts.rootElement, opts.mode)
    }

    let elements: HTMLElement[] | undefined

    if (opts.elements != null) {
      elements = opts.elements
    } else if (opts.cssSelectors === 'none') {
      elements = []
    } else if (opts.cssSelectors != null) {
      elements = Array.from(
        opts.rootElement.querySelectorAll(opts.cssSelectors)
      )
    } else {
      throw new Error('Specify elements or cssSelectors')
    }

    if (elements != null) {
      const all = []
      for (const element of elements) {
        all.push(new DomStepElement(element, opts.useVisibliltyProp))
      }
      return all
    }

    throw new Error('No HTML elements were found')
  }

  private collectSubsetElements (
    elementsAll: DomStepElement[],
    subsetSelector?: string | undefined
  ): DomStepElement[] {
    if (subsetSelector != null) {
      return selectSubset(subsetSelector, {
        elements: elementsAll,
        shiftSelector: -1
      })
    }
    return elementsAll
  }

  private applySpecializedSelectors (
    rootElement: HTMLElement,
    name: 'words' | 'sentences' | 'inkscape-levels' | 'inkscape-level-elements'
  ): DomStepElement[] {
    if (name === 'words') {
      return selectWords(rootElement)
    } else if (name === 'sentences') {
      return selectSentences(rootElement)
    } else {
      throw new Error(`Unkown specialized selector: ${name}`)
    }
  }

  /**
   * `elements` + 1
   */
  get count (): number {
    return this.elements.length + 1
  }

  /**
   * `elementsAll` + 1
   */
  get countAll (): number {
    return this.elementsAll.length + 1
  }

  /**
   * For debugging purposes.
   */
  get htmlElements (): HTMLOrSVGElement[] {
    const htmlElements = []
    for (const domStep of this.elements) {
      const elements = domStep.htmlElements
      if (Array.isArray(elements)) {
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
  hideAll (): void {
    for (const element of this.elementsAll) {
      element.hide()
    }
  }

  /**
   * Set the display / visiblilty state on HTML elements. Loop through all
   * elements or perform a minimal update. On the first step no elements are
   * displayed. The number of steps is: number of elements + 1.
   * A minimal update doesn’t loop through all elements, only the visibility
   * state of the next element is changed.
   *
   * @returns The element that is displayed by the new step number.
   */
  displayByNo ({
    stepNo,
    oldStepNo,
    full
  }: DisplayOptions): HTMLOrSVGElement | undefined {
    if (this.elements == null || this.elements.length == null) {
      return
    }
    // Loop through all elements. Set visibility state on all elements
    // Full update
    if (
      oldStepNo == null ||
      (full != null && full) ||
      store.getters['lamp/nav/fullStepUpdate'] === true ||
      stepNo === 1 ||
      (oldStepNo === 1 && stepNo === this.count)
    ) {
      let count = 1
      for (const domStep of this.elements) {
        const showElement = stepNo > count
        domStep.setState(showElement)
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
    if (domStep != null) {
      domStep.show()
      return domStep.htmlElement
    }
  }

  /**
   * TODO: Implement vuex support
   */
  shortcutsRegister (): void {
    for (const element of this.elements) {
      const shortcut = element.htmlElement.getAttribute('baldr-shortcut')
      const description = element.htmlElement.getAttribute('inkscape:label')
      if (shortcut != null && description != null) {
        vm.$shortcuts.add(
          `q ${shortcut}`,
          () => {
            element.show()
          },
          `${description} (einblenden in SVG)`
        )
      }
    }
  }

  shortcutsUnregister (): void {
    if (this.elements == null) {
      return
    }
    for (const element of this.elements) {
      const shortcut = element.htmlElement.getAttribute('baldr-shortcut')
      if (shortcut != null) {
        vm.$shortcuts.remove(`q ${shortcut}`)
      }
    }
  }
}

/**
 * Generate steps by hiding and showing some DOM elements.
 */
export class ControllerNg {
  /**
   * All elements
   */
  stepElements: DomStepElement[]

  subsetIndexes?: number[]

  constructor (steps: DomStepElement[], subsetSpecifier?: string) {
    this.stepElements = steps
    if (subsetSpecifier != null) {
      this.subsetIndexes = buildSubsetIndexes(
        subsetSpecifier,
        this.stepElements.length + 1,
        -2
      )
    }
  }

  /**
   * The number of steps
   */
  get count (): number {
    if (this.subsetIndexes != null) {
      return this.subsetIndexes.length + 1
    }
    return this.stepElements.length + 1
  }

  /**
   * Hide all elements.
   */
  hideAll (): void {
    for (const step of this.stepElements) {
      step.hide()
    }
  }

  getStep (indexFromZero: number): DomStepElement {
    let index = indexFromZero
    if (this.subsetIndexes != null) {
      index = this.subsetIndexes[index]
    }
    return this.stepElements[index]
  }

  /**
   * Set the display / visiblilty state on HTML elements. Loop through all
   * elements or perform a minimal update. On the first step no elements are
   * displayed. The number of steps is: number of elements + 1.
   *
   * @param stepNumber - A consecutive number from 1 (all step elements are
   *   hidden) to step element count + 1.
   *
   * @returns The element that is displayed by the new step number.
   */
  showUpTo (stepNumber: number): HTMLOrSVGElement | undefined {
    let currentElement: HTMLOrSVGElement | undefined = undefined
    for (let index = 0; index < this.count - 1; index++) {
      const step = this.getStep(index)
      step.setState(stepNumber > index + 1)
      if (stepNumber === index + 2) {
        currentElement = step.htmlElement
      }
    }
    return currentElement
  }
}

/**
 * Wrap each word in a string into `<span class="word">…</span>`
 * @see {@link https://stackoverflow.com/a/26030835}
 */
export function wrapWords (text: string): string {
  if (Array.isArray(text)) {
    text = text.join(' ')
  }
  text = text.replace(/\s+/g, ' ')
  const dom = new DOMParser().parseFromString(text, 'text/html')
  // First a simple implementation of recursive descent,
  // visit all nodes in the DOM and process it with a callback:
  function walkDOM (
    node: HTMLElement,
    callback: (n: HTMLElement) => void
  ): void {
    if (node.nodeName !== 'SCRIPT') {
      // ignore javascript
      callback(node)
      for (let i = 0; i < node.childNodes.length; i++) {
        walkDOM(node.childNodes[i] as HTMLElement, callback)
      }
    }
  }

  const textNodes: Node[] = []
  walkDOM(dom.body, function (n: Node) {
    if (n.nodeType === 3) {
      textNodes.push(n)
    }
  })

  /**
   * Add a HTML element before the other element. Simple utility functions to
   * avoid a lot of typing.
   */
  function insertBefore (newElement: Node, element: Node): void {
    element.parentNode?.insertBefore(newElement, element)
  }

  /**
   * Remove a HTML element.
   */
  function removeElement (element: Node): void {
    element.parentNode?.removeChild(element)
  }

  /**
   * Wrap a text string with `<span class="word">…</span>`
   */
  function makeSpan (txt: string): Node {
    const span = document.createElement('span')
    span.classList.add('word')
    span.appendChild(makeText(txt))
    return span
  }

  /**
   * Convert a text string into a text node.
   */
  function makeText (txt: string): Node {
    return document.createTextNode(txt)
  }

  for (let i = 0; i < textNodes.length; i++) {
    const node = textNodes[i]
    const txt = node.nodeValue
    // A avoid spaces surrounded by <span class="word"></span>
    if (txt != null && txt !== ' ') {
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
 */
function selectWords (rootElement: HTMLElement): DomStepElement[] {
  const d = document as unknown
  if (rootElement == null) {
    rootElement = d as HTMLElement
  }
  const wordsRaw = rootElement.querySelectorAll<HTMLElement>('span.word')
  const words = []
  for (const word of wordsRaw) {
    if (word.previousSibling == null) {
      const parent = word.parentElement
      if (parent != null && parent.tagName === 'LI') {
        if (parent.previousSibling == null && parent.parentElement != null) {
          // <ul><li><span class="word">lol</span><li></ul>
          words.push(
            new DomStepElement([parent.parentElement, parent, word], true)
          )
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

function countWords (dom: HTMLElement): number {
  return dom.querySelectorAll('span.word').length
}

/**
 * Select more than a word. The meaning  of "sentences" in the function name
 * should not be understood literally, but symbolic for a longer text unit.
 * Select a whole paragraph (`<p>`) or a heading `<h1>` or `<li>` items of
 * ordered or unordered lists, or a table row.
 */
function selectSentences (rootElement: HTMLElement): DomStepElement[] {
  const sentences = []
  for (const element of rootElement.children) {
    if (['UL', 'OL'].includes(element.tagName)) {
      for (const li of element.children) {
        if (li.tagName === 'LI') {
          sentences.push(new DomStepElement(li as HTMLElement, true))
        }
      }
    } else {
      sentences.push(new DomStepElement(element as HTMLElement, true))
    }
  }
  return sentences
}

function countSentences (parentElement: HTMLElement): number {
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

abstract class Selector {
  rootElement: ParentNode

  constructor (entry: string | HTMLOrSVGElement) {
    if (typeof entry === 'string') {
      // Cloze-SVG:
      // <?xml version="1.0" encoding="UTF-8"?>
      // <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 595.276 841.89" version="1.1">
      // <defs>

      // Inkscape-SVG:
      // <?xml version="1.0" encoding="UTF-8" standalone="no"?>
      // <svg
      //    xmlns:dc="http://purl.org/dc/elements/1.1/"
      //    xmlns:cc="http://creativecommons.org/ns#"
      //    xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
      //    xmlns:svg="http://www.w3.org/2000/svg"
      //    xmlns="http://www.w3.org/2000/svg"
      //    xmlns:xlink="http://www.w3.org/1999/xlink"
      //    id="svg8"
      //    version="1.1"
      //    viewBox="0 0 169.17574 95.783676">
      let type = 'text/html' as DOMParserSupportedType
      if (entry.indexOf('<?xml') === 0) {
        type = 'image/svg+xml'
      }
      const dom = new DOMParser().parseFromString(entry, type)
      this.rootElement = dom.documentElement
    } else {
      this.rootElement = entry
    }
  }

  abstract select (): DomStepElement[]

  count (): number {
    // Assumes that all elements are hidden for the first step.
    return this.select().length + 1
  }
}

export class ElementSelector extends Selector {
  private readonly selectors: string

  constructor (entry: string | HTMLOrSVGElement, selectors: string) {
    super(entry)
    this.selectors = selectors
  }

  select () {
    const result: DomStepElement[] = []
    const nodeList = this.rootElement.querySelectorAll<HTMLOrSVGElement>(
      this.selectors
    )
    for (const element of nodeList) {
      result.push(new DomStepElement(element, true))
    }
    return result
  }
}

type InkscapeMode = 'layer' | 'layer+' | 'group'

export class InkscapeSelector extends Selector {
  mode: InkscapeMode

  constructor (entry: string | HTMLOrSVGElement, mode: InkscapeMode = 'layer') {
    super(entry)
    this.mode = mode
  }

  private getLayerElements (
    rootElement: ParentNode,
    mode: InkscapeMode
  ): SVGGElement[] {
    const layers = rootElement.querySelectorAll<SVGGElement>('g')
    const result: SVGGElement[] = []
    for (const layer of layers) {
      if (mode !== 'group') {
        const attribute = layer.attributes.getNamedItem('inkscape:groupmode')
        if (attribute != null && attribute.nodeValue === 'layer') {
          result.push(layer)
        }
      } else {
        result.push(layer)
      }
    }
    return result
  }

  select (): DomStepElement[] {
    const layers = this.getLayerElements(this.rootElement, this.mode)
    const result = []
    if (this.mode === 'layer+') {
      for (const layer of layers) {
        for (let index = 0; index < layer.children.length; index++) {
          const c = layer.children.item(index) as unknown
          if (c == null) {
            throw new Error('SVG child layer selection failed')
          }
          const child = c as HTMLOrSVGElement
          if (index === 0) {
            result.push(new DomStepElement([layer, child], false))
          } else {
            result.push(new DomStepElement(child, false))
          }
        }
      }
    } else if (this.mode === 'layer' || this.mode === 'group') {
      for (const layer of layers) {
        result.push(new DomStepElement(layer, false))
      }
    }
    return result
  }
}

export class ClozeSelector extends Selector {
  select () {
    const groups = this.rootElement.querySelectorAll<SVGElement>('svg g')
    const clozeGElements = []
    for (const group of groups) {
      if (group.style.fill === 'rgb(0, 0, 255)') {
        clozeGElements.push(new DomStepElement(group))
      }
    }
    return clozeGElements
  }
}

/**
 * Assumes that all elements are hidden for the first step.
 */
export function calculateStepCount (
  elements: number | NodeList,
  props: StepSubProps,
  shiftSelector = 0
): number {
  let count
  if (elements instanceof NodeList || Array.isArray(elements)) {
    count = elements.length
  } else {
    count = elements
  }
  if (props.stepSubset != null) {
    const elementsSubset = selectSubset(props.stepSubset, {
      elementsCount: count,
      shiftSelector
    })
    return elementsSubset.length + 1
  } else {
    return count + 1
  }
}

interface StepSubProps {
  stepMode?: 'words' | 'sentences'
  stepSubset?: string
}

/**
 * Precalculate the step count of a text.
 */
export function calculateStepCountText (
  text: string,
  props: StepSubProps,
  shiftSelector: number = 0
): number {
  const dom = new DOMParser().parseFromString(text, 'text/html')
  const d = dom as unknown

  let allElementsCount: number = 0
  if (props.stepMode === 'words') {
    allElementsCount = countWords(d as HTMLElement)
  } else if (props.stepMode === 'sentences') {
    allElementsCount = countSentences(d as HTMLElement)
  }

  return calculateStepCount(allElementsCount, props, shiftSelector)
}

export function generateSlideStepsFromText (
  text: string,
  props: StepSubProps
): SlideStep[] {
  const dom = new DOMParser().parseFromString(text, 'text/html')
  const d = dom as unknown
  const options: DomStepOptions = {
    rootElement: d as HTMLElement
  }

  if (props.stepMode != null) {
    options.mode = props.stepMode
  }

  if (props.stepSubset != null) {
    options.subsetSelector = props.stepSubset
  }
  const domSteps = new DomStepController(options)
  const slideSteps = []
  for (let i = 0; i < domSteps.elements.length; i++) {
    const domStep = domSteps.elements[i]
    slideSteps.push(new SlideStep({ no: i + 2, title: domStep.text }))
  }
  return slideSteps
}
