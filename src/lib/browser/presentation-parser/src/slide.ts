import { DataCutter } from './data-management'

/**
 * Get the intersection between all master names and the slide keys.
 *
 * This method can be used to check that a slide object uses only
 * one master slide.
 *
 * @return The intersection as an array
 */
function intersect (array1: string[], array2: string[]) {
  return array1.filter(n => array2.includes(n))
}

/**
 * The meta data of a slide. Each slide object owns one meta data object.
 */
export class SlideMetaData {
  /**
   * The ID of a slide (Used for links)
   */
  ref?: string

  /**
   * The title of a slide.
   */
  title?: string

  /**
   * Some text that describes the slide.
   */
  description?: string

  /**
   * The source of the slide, for example a HTTP URL.
   */
  source?: string

  /**
   * @param {Object} rawSlideObject
   */
  constructor (data: DataCutter) {
    this.ref = data.cutString('ref')
    this.title = data.cutString('title')
    this.description = data.cutString('description')
    this.source = data.cutString('source')
  }
}

export class Slide {
  metaData: SlideMetaData

  constructor (raw: any) {
    const data = new DataCutter(raw)

    this.metaData = new SlideMetaData(data)
  }
}
