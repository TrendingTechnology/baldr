// Do not remove this lines. The comments are removed by the build script.
// <- const { JSDOM } = require('jsdom')
// <- const DOMParser = new JSDOM().window.DOMParser

import { HTMLSVGElement, Step } from './step'

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
      const dom = new DOMParser().parseFromString(entry, type)
      this.rootElement = dom.documentElement
    } else {
      this.rootElement = entry
    }
  }

  abstract select (): Step[]

  count (): number {
    // Assumes that all elements are hidden for the first step.
    return this.select().length + 1
  }
}

export class ElementSelector extends Selector {
  private readonly selectors: string

  constructor (entry: string | HTMLSVGElement, selectors: string) {
    super(entry)
    this.selectors = selectors
  }

  select (): Step[] {
    const result: Step[] = []
    const nodeList = this.rootElement.querySelectorAll<HTMLSVGElement>(
      this.selectors
    )
    for (const element of nodeList) {
      result.push(new Step(element, true))
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

  select (): Step[] {
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
            result.push(new Step([layer, child], false))
          } else {
            result.push(new Step(child, false))
          }
        }
      }
    } else if (this.mode === 'layer' || this.mode === 'group') {
      for (const layer of layers) {
        result.push(new Step(layer, false))
      }
    }
    return result
  }
}

export class ClozeSelector extends Selector {
  select (): Step[] {
    const groups = this.rootElement.querySelectorAll<SVGElement>('svg g')
    const clozeGElements = []
    for (const group of groups) {
      if (group.style.fill === 'rgb(0, 0, 255)') {
        clozeGElements.push(new Step(group))
      }
    }
    return clozeGElements
  }
}
