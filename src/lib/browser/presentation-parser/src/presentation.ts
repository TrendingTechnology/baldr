import { convertFromYaml } from '@bldr/yaml'
import { LampTypes } from '@bldr/type-definitions'

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
    this.ref = this.getStringProperty(raw, 'ref')
    this.uuid = this.getStringProperty(raw, 'uuid')
    this.title = this.getStringProperty(raw, 'title')
    this.subject = this.getStringProperty(raw, 'subject')
    this.curriculum = this.getStringProperty(raw, 'curriculum')

    this.checkNull(raw, 'grade')
    this.checkNumber(raw, 'grade')
    this.grade = raw.grade

    if (raw.curriculumUrl !== null && typeof raw.curriculumUrl === 'string') {
      this.curriculumUrl = raw.curriculumUrl
    }

    if (raw.subtitle !== null && typeof raw.subtitle === 'string') {
      this.subtitle = raw.subtitle
    }
  }

  private checkString (raw: any, propertyName: string) {
    if (typeof raw[propertyName] !== 'string') {
      throw new Error(`meta.${propertyName} is not a string.`)
    }
  }

  private checkNumber (raw: any, propertyName: string) {
    if (typeof raw[propertyName] !== 'number') {
      throw new Error(`meta.${propertyName} is not a number.`)
    }
  }

  private checkNull (raw: any, propertyName: string): void {
    if (raw[propertyName] == null) {
      throw new Error(`meta.${propertyName} must not be zero.`)
    }
  }

  private getStringProperty (raw: any, propertyName: string): string {
    this.checkNull(raw, propertyName)
    this.checkString(raw, propertyName)
    return raw[propertyName]
  }
}

export class Presentation {
  meta: LampTypes.PresentationMeta
  constructor (yamlString: string) {
    const raw = convertFromYaml(yamlString)
    if (raw.meta == null) {
      throw new Error('No meta informations found.')
    }

    this.meta = new Meta(raw.meta)
  }
}
