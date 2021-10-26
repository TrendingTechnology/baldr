import { convertFromYaml } from '@bldr/yaml'
import { LampTypes } from '@bldr/type-definitions'

import { DataCutter } from './data-management'

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
}

export class Presentation {
  meta: LampTypes.PresentationMeta
  constructor (yamlString: string) {
    const raw = convertFromYaml(yamlString)
    const data = new DataCutter(raw)
    this.meta = new Meta(data.cutNotNull('meta'))
  }
}
