import { DataCutter } from './data-management'
import { convertToString } from '@bldr/core-browser'
import { masterCollection } from './master-collection'
import {  Master, FieldData } from './masters/_types'

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
  /**
   * The slide number
   */
  no: number

  /**
   * The level in the hierarchial slide tree.
   */
  level: number

  /**
   * An array of child slide objects.
   */
  slides?: Slide[]

  metaData: SlideMetaData
  master: Master

  /**
   * In this attribute we save the normalized field data of a slide.
   */
  fields?: FieldData

  /**
   * Props (properties) to send to the main Vue master component.
   */
  propsMain?: any

  /**
   * Props (properties) to send to the preview Vue master component.
   */
  propsPreview?: any

  constructor (raw: any, no: number, level: number) {
    this.no = no
    this.level = level
    const data = new DataCutter(raw)
    this.metaData = new SlideMetaData(data)
    this.master = this.detectMaster(data)

    if (this.master.normalizeFields != null) {
      this.fields = this.master.normalizeFields(data.cutAny(this.master.name))
    }
  }

  private detectMaster (data: DataCutter): Master {
    const masterNames = Object.keys(masterCollection)
    const intersection = masterNames.filter(masterName =>
      data.keys.includes(masterName)
    )

    if (intersection.length === 0) {
      throw new Error(`No master slide found: ${convertToString(data.raw)}`)
    }

    if (intersection.length > 1) {
      throw new Error(
        `Each slide must have only one master slide: ${convertToString(
          data.raw
        )}`
      )
    }

    return masterCollection[intersection[0]]
  }
}
