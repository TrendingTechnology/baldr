import { convertFromYaml } from '@bldr/yaml'
import { LampTypes } from '@bldr/type-definitions'

import { DataCutter } from './data-management'
import { SlideCollection } from './slide-collection'
import { Resolver } from '@bldr/media-resolver-ng'
import * as log from '@bldr/log'

export const resolver = new Resolver()

/**
 * @inheritdoc
 */
class Meta implements LampTypes.PresentationMeta {
  /**
   * @inheritdoc
   */
  ref: string

  /**
   * @inheritdoc
   */
  uuid: string

  /**
   * @inheritdoc
   */
  title: string

  /**
   * @inheritdoc
   */
  subtitle?: string

  /**
   * @inheritdoc
   */
  subject: string

  /**
   * @inheritdoc
   */
  grade: number

  /**
   * @inheritdoc
   */
  curriculum: string

  /**
   * @inheritdoc
   */
  curriculumUrl?: string

  constructor (raw: any) {
    const data = new DataCutter(raw)
    this.ref = data.cutStringNotNull('ref')
    this.uuid = data.cutStringNotNull('uuid')
    this.title = data.cutStringNotNull('title')
    this.subtitle = data.cutString('subtitle')
    this.subject = data.cutStringNotNull('subject')
    this.grade = data.cutNumberNotNull('grade')
    this.curriculum = data.cutStringNotNull('curriculum')
    this.curriculumUrl = data.cutString('curriculumUrl')
    data.checkEmpty()
  }

  /**
   * Log to the console.
   */
  public log (): void {
    console.log(log.formatObject(this, { indentation: 2 }))
  }
}

export class Presentation {
  meta: Meta
  slides: SlideCollection

  constructor (yamlString: string) {
    const raw = convertFromYaml(yamlString)
    const data = new DataCutter(raw)
    this.meta = new Meta(data.cutNotNull('meta'))
    this.slides = new SlideCollection(data.cutNotNull('slides'))
    data.checkEmpty()
  }

  public async resolveMediaAssets (): Promise<void> {
    await resolver.resolve(this.slides.mediaUris, true)
    await resolver.resolve(this.slides.optionalMediaUris, false)
  }

  /**
   * Log to the console.
   */
  public log (): void {
    this.meta.log()
    for (const slide of this.slides.flat) {
      slide.log()
    }
  }
}
