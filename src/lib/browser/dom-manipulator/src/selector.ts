import { DOMParserU } from '@bldr/universal-dom'

import { HTMLSVGElement, StepElement } from './step'

abstract class Selector {
  rootElement: ParentNode

  constructor (entry: string | HTMLSVGElement) {
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
    return new StepElement(htmlElements, true)
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

type InkscapeMode = 'layer' | 'layer+' | 'group'

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
            result.push(new StepElement([layer, child], false))
          } else {
            result.push(new StepElement(child, false))
          }
        }
      }
    } else if (this.mode === 'layer' || this.mode === 'group') {
      for (const layer of layers) {
        result.push(new StepElement(layer, false))
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
    const wordsRaw = this.rootElement.querySelectorAll<HTMLElement>('span.word')
    const words = []
    for (const word of wordsRaw) {
      if (word.previousSibling == null) {
        const parent = word.parentElement
        if (parent != null && parent.tagName === 'LI') {
          if (parent.previousSibling == null && parent.parentElement != null) {
            // <ul><li><span class="word">lol</span><li></ul>
            words.push(
              new StepElement([parent.parentElement, parent, word], true)
            )
          } else {
            // Avoid to get divs. Parent has to be LI
            words.push(new StepElement([parent, word], true))
          }
        } else {
          words.push(new StepElement(word, true))
        }
      } else {
        words.push(new StepElement(word, true))
      }
    }
    return words
  }
}
