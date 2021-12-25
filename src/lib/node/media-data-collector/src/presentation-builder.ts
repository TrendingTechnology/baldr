import { DeepTitle } from '@bldr/titles'

import { Builder } from './builder'

/**
 * The meta informations of a presentation file.
 *
 * ```yaml
 * meta:
 *   ref: An unique reference string
 *   uuid: 75bd3ec8-a322-477c-ad7a-5915513f9dd8
 *   path: path/to/Praesenation.baldr.yml
 *   title: A title
 *   subtitle: A subtitle
 *   subject: Musik
 *   grade: The grade the presentation belongs to.
 *   curriculum: Relation to the curriculum.
 *   curriculum_url: http://curriculum.com
 * ```
 */
interface PresentationMetaData {
  /**
   * A reference string to identify the presentation (for example:
   * `Wiener-Klassik`)
   */
  ref: string

  /**
   * A Universally Unique Identifier to identify the presentation.
   */
  uuid?: string

  path?: string

  /**
   * The title of the presentation. (for example: `Das orchestrale Klangbild bei
   * Beethoven`)
   */
  title: string

  /**
   * The subtitle of the presentation in the form: `<em
   * class="person">Composer</em>: <em class="piece">Piece</em> (year)`. (for
   * example: `<em class="person">Ludwig van Beethoven</em>: <em
   * class="piece">Sinfonie Nr. 8 F-Dur op. 93</em> (1812)`)
   */
  subtitle?: string

  /**
   * The school subject, for example `Musik` or `Informatik`.
   */
  subject?: string

  /**
   * The grade the presentation belongs to. (for example: `11`)
   */
  grade?: number

  /**
   * Relation to the curriculum. (for example: `Klangkörper im Wandel / Das
   * Klangbild der Klassik`)
   */
  curriculum?: string

  /**
   * URL of the curriculum web page. (for example:
   * `https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/5/musik`)
   */
  curriculumUrl?: string
}

export interface PresentationData {
  meta: PresentationMetaData
  slides: any[]
}

export class PresentationBuilder extends Builder {
  data: PresentationData

  constructor (filePath: string) {
    super(filePath)

    const data: Record<string, any> = {}

    this.importYamlFile(this.absPath, data)

    if (data.meta == null) {
      throw new Error(
        `The presentation “${this.absPath}” needs a property named “meta”.`
      )
    }

    if (data.slides == null) {
      throw new Error(
        `The presentation “${this.absPath}” needs a property named “slide”.`
      )
    }

    this.data = {
      meta: data.meta,
      slides: data.slides
    }

    this.data.meta.path = this.relPath
  }

  public enrichMetaProp (): PresentationBuilder {
    const title = new DeepTitle(this.absPath)
    const meta = title.generatePresetationMeta()
    if (this.data.meta.ref == null && meta.ref != null) {
      this.data.meta.ref = meta.ref
    }
    if (this.data.meta.title == null && meta.title != null) {
      this.data.meta.title = meta.title
    }
    if (this.data.meta.subtitle == null && meta.subtitle != null) {
      this.data.meta.subtitle = meta.subtitle
    }
    if (this.data.meta.subject == null && meta.subject != null) {
      this.data.meta.subject = meta.subject
    }
    if (this.data.meta.grade == null && meta.grade != null) {
      this.data.meta.grade = meta.grade
    }
    if (this.data.meta.curriculum == null && meta.curriculum != null) {
      this.data.meta.curriculum = meta.curriculum
    }
    return this
  }

  public build (): PresentationData {
    this.enrichMetaProp()
    return this.data
  }
}
