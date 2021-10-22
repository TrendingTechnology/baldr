import { convertFromYaml } from '@bldr/yaml'
import { LampTypes } from '@bldr/type-definitions'

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

  constructor (rawObject: any) {
    this.ref = this.getStringProperty(rawObject, 'ref')
    this.title = this.getStringProperty(rawObject, 'title')
    this.subtitle = this.getStringProperty(rawObject, 'subtitle')
    this.subject = this.getStringProperty(rawObject, 'subject')
    this.curriculum = this.getStringProperty(rawObject, 'curriculum')

    this.checkNull(rawObject, 'grade')
    if (typeof rawObject.grade !== 'number') {
      throw new Error(`meta.grade is not a number.`)
    }
    this.grade = rawObject.grade
  }

  private checkNull (raw: any, propertyName: string): void {
    if (raw[propertyName] == null) {
      throw new Error(`meta.${propertyName} must not be zero.`)
    }
  }

  private getStringProperty (raw: any, propertyName: string): string {
    this.checkNull(raw, propertyName)

    if (typeof raw[propertyName] !== 'string') {
      throw new Error(`meta.${propertyName} is not a string.`)
    }

    return raw[propertyName]
  }
}

class Presentation {
  meta: LampTypes.PresentationMeta
  constructor (yamlString: string) {
    const raw = convertFromYaml(yamlString)
    if (raw.meta == null) {
      throw new Error('No meta informations found.')
    }

    this.meta = new Meta(raw.meta)
  }
}

export function parse (yamlString: string): Presentation {
  return new Presentation(yamlString)
}
