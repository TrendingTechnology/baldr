import type { LampTypes } from '@bldr/type-definitions'

import { RawDataObject } from '@bldr/core-browser'
import { convertMarkdownToHtml } from '@bldr/markdown-to-html'

import { masterCollection } from './master-collection'

/**
 * Meta informations can be added to each slide. All properties are possibly
 * undefined.
 */
class SlideMetaData implements LampTypes.SlideMeta {
  id?: string
  title?: string
  description?: string
  source?: string
  private readonly raw: RawDataObject
  constructor (raw: RawDataObject) {
    this.raw = raw
    this.id = this.cutAndConvert('id')
    this.title = this.cutAndConvert('title')
    this.description = this.cutAndConvert('description')
    this.source = this.cutAndConvert('source')
  }

  private cutAndConvert (property: string): any {
    const value = this.raw.cut(property)
    if (value) {
      return convertMarkdownToHtml(value)
    }
  }
}

/**
 * A slide.
 */
export class Slide implements LampTypes.Slide {
  rawData: any
  no: number
  level: number
  meta: LampTypes.SlideMeta
  slides: Slide[]
  master: LampTypes.Master
  props: LampTypes.StringObject
  propsMain?: LampTypes.StringObject
  propsPreview?: LampTypes.StringObject
  mediaUris?: Set<string>
  optionalMediaUris?: Set<string>
  stepCount?: number
  stepNo?: number
  constructor (rawData: any) {
    const raw = new RawDataObject(rawData)
    this.meta = new SlideMetaData(raw)
    this.rawData = rawData
    this.no = 0
    this.level = 0
    this.slides = []
    this.master = masterCollection.findMaster(rawData)
    this.props = this.master.normalizeProps(raw.cut(this.master.name))
    this.master.detectUnkownProps(this.props)
    this.master.convertMarkdownToHtml(this.props)
    this.master.validateUris(this.props)
    this.mediaUris = this.master.resolveMediaUris(this.props)
    this.optionalMediaUris = this.master.resolveOptionalMediaUris(this.props)
  }
}
