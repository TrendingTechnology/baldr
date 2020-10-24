/**
 * Some basic Typescript interfaces and type defintions.
 *
 * @module @bldr/type-definitions/presentation
 */

 /**
  * The meta informations of a presentation file.
  */
export interface PresentationMetaFileFormat {

  /**
   * An unique ID.
   */
  id: string

  /**
   * The title of the presentation.
   */
  title: string

  /**
   * The subtitle of the presentation.
   */
  subtitle?: string

  /**
   * The grade the presentation belongs to.
   */
  grade: number

  /**
   * Relation to the curriculum.
   */
  curriculum: string

  /**
   * URL of the curriculum web page.
   */
  curriculumUrl?: string
}

export interface PresentationFileFormat {
  meta: PresentationMetaFileFormat
  slides: object
}
