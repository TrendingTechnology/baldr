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
  uuid?: string

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
  subject?: string

  /**
   * @inheritdoc
   */
  grade?: number

  /**
   * @inheritdoc
   */
  curriculum?: string

  /**
   * @inheritdoc
   */
  curriculumUrl?: string

  constructor (raw: any) {
    const data = new DataCutter(raw)
    this.ref = data.cutStringNotNull('ref')
    this.uuid = data.cutString('uuid')
    this.title = data.cutStringNotNull('title')
    this.subtitle = data.cutString('subtitle')
    this.subject = data.cutString('subject')
    this.grade = data.cutNumber('grade')
    this.curriculum = data.cutString('curriculum')
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
    this.meta = this.cutMeta(data)
    this.slides = new SlideCollection(data.cutNotNull('slides'))
    data.checkEmpty()
  }

  private cutMeta (data: DataCutter): Meta {
    const meta = data.cutAny('meta')
    const title = data.cutString('title')
    const ref = data.cutString('ref')

    if (meta != null && (title != null || ref != null)) {
      throw new Error(
        'Specify the “title” or “ref” inside or outside of the “meta” property not both!'
      )
    }

    if (meta != null) {
      return new Meta(meta)
    }

    if (title == null || ref == null) {
      throw new Error('Specify both title and ref!')
    }

    return new Meta({ title, ref })
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

    const assets = resolver.exportAssets(this.slides.mediaUris)
    for (const asset of assets) {
      console.log(log.formatObject(asset.yaml, { keys: ['title', 'ref'] }))
    }
  }
}
