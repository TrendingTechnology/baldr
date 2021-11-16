import { DOMParserU } from '@bldr/universal-dom'

import { HTMLSVGElement, StepElement } from './step'

export type DomEntry = string | HTMLSVGElement

abstract class Selector {
  rootElement: ParentNode

  constructor (entry: DomEntry) {
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
      const dom = new DOMParserU().parseFromString(entry, type)
      this.rootElement = dom.documentElement
    } else {
      this.rootElement = entry
    }
  }

  abstract select (): StepElement[]

  public count (): number {
    // Assumes that all elements are hidden for the first step.
    return this.select().length + 1
  }

  protected createStep (...htmlElements: HTMLSVGElement[]): StepElement {
    return new StepElement(htmlElements)
  }

  public static collectStepTexts (steps: StepElement[]): string[] {
    const result: string[] = []
    for (const step of steps) {
      if (step.text != null) {
        result.push(step.text)
      }
    }
    return result
  }
}

export class ElementSelector extends Selector {
  private readonly selectors: string

  /**
   * @param entry - A string that can be translated to a DOM using the DOMParser
   *   or a HTML element as an entry to the DOM.
   * @param selectors - A string to feed `document.querySelectorAll()`.
   */
  constructor (entry: string | HTMLSVGElement, selectors: string) {
    super(entry)
    this.selectors = selectors
  }

  select (): StepElement[] {
    const result: StepElement[] = []
    const nodeList = this.rootElement.querySelectorAll<HTMLSVGElement>(
      this.selectors
    )
    for (const element of nodeList) {
      result.push(this.createStep(element))
    }
    return result
  }
}

export type InkscapeMode = 'layer' | 'layer+' | 'group'

export class InkscapeSelector extends Selector {
  mode: InkscapeMode

  constructor (entry: string | HTMLSVGElement, mode: InkscapeMode = 'layer') {
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

  select (): StepElement[] {
    const layers = this.getLayerElements(this.rootElement, this.mode)
    const result = []
    if (this.mode === 'layer+') {
      for (const layer of layers) {
        for (let index = 0; index < layer.children.length; index++) {
          const c = layer.children.item(index) as unknown
          if (c == null) {
            throw new Error('SVG child layer selection failed')
          }
          const child = c as HTMLSVGElement
          if (index === 0) {
            result.push(new StepElement([layer, child]))
          } else {
            result.push(new StepElement(child))
          }
        }
      }
    } else if (this.mode === 'layer' || this.mode === 'group') {
      for (const layer of layers) {
        result.push(new StepElement(layer))
      }
    }
    return result
  }
}

export class ClozeSelector extends Selector {
  select (): StepElement[] {
    const groups = this.rootElement.querySelectorAll<SVGElement>('svg g')
    const clozeGElements = []
    for (const group of groups) {
      // JSDOM: rgb(0%,0%,100%)
      if (
        group.style.fill === 'rgb(0, 0, 255)' ||
        group.style.fill === 'rgb(0%,0%,100%)'
      ) {
        clozeGElements.push(new StepElement(group))
      }
    }
    return clozeGElements
  }
}

/**
 * Select words which are surrounded by `span.word`.
 */
export class WordSelector extends Selector {
  select (): StepElement[] {
    const words = this.rootElement.querySelectorAll<HTMLElement>('span.word')
    const steps = []
    for (const word of words) {
      if (this.isFirstUlOlWord(word)) {
        steps.push(this.createStepWithGrandpa(word))
      } else if (this.isFirstLiWord(word)) {
        steps.push(this.createStepWithDad(word))
      } else {
        steps.push(new StepElement(word))
      }
    }
    return steps
  }

  private isUlOlWord (kid: HTMLElement): boolean {
    const dad = kid.parentElement
    const grandpa = dad != null ? dad.parentElement : null
    if (
      dad != null &&
      grandpa != null &&
      dad.tagName === 'LI' &&
      (grandpa.tagName === 'OL' || grandpa.tagName === 'UL')
    ) {
      return true
    }
    return false
  }

  /**
   * `<ul><li><span class="word">First</span><li></ul>`
   */
  private isFirstUlOlWord (kid: HTMLElement): boolean {
    const dad = kid.parentElement
    if (
      this.isUlOlWord(kid) &&
      kid.previousSibling == null &&
      dad?.previousSibling == null
    ) {
      return true
    }
    return false
  }

  /**
   * `<li><span class="word">First</span><li>`
   */
  private isFirstLiWord (kid: HTMLElement): boolean {
    const dad = kid.parentElement
    if (
      this.isUlOlWord(kid) &&
      kid.previousSibling == null &&
      dad?.previousSibling != null
    ) {
      return true
    }
    return false
  }

  private createStepWithGrandpa (kid: HTMLElement): StepElement {
    if (kid.parentElement == null || kid.parentElement.parentElement == null) {
      throw new Error('kid element must have a dad and grandpa element')
    }
    return new StepElement([
      kid.parentElement.parentElement,
      kid.parentElement,
      kid
    ])
  }

  private createStepWithDad (kid: HTMLElement): StepElement {
    if (kid.parentElement == null) {
      throw new Error('kid element must have a dad element')
    }
    return new StepElement([kid.parentElement, kid])
  }
}

/**
 * Select more than a word. The meaning  of "sentences" in the function name
 * should not be understood literally, but symbolic for a longer text unit.
 * Select a whole paragraph (`<p>`) or a heading `<h1>` or `<li>` items of
 * ordered or unordered lists, or a table row.
 */
export class SentenceSelector extends Selector {
  select (): StepElement[] {
    const sentences = []
    for (const element of this.rootElement.children) {
      if (['UL', 'OL'].includes(element.tagName)) {
        for (const li of element.children) {
          if (li.tagName === 'LI') {
            sentences.push(new StepElement(li as HTMLElement))
          }
        }
      } else {
        sentences.push(new StepElement(element as HTMLElement))
      }
    }
    return sentences
  }
}
