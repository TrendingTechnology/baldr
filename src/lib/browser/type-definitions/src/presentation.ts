/**
 * The format of the `Praesentation.baldr.yml` file format.
 *
 * @module @bldr/type-definitions/presentation
 */

import { Master, StringObject } from './master'

/**
 * Meta informations can be added to each slide. All properties are possibly
 * undefined.
 */
export class SlideMeta {
  /**
   * An unique reference string of a slide (Used for links). Markdown is supported in this property.
   */
  ref?: string

  /**
   * The title of a slide. Markdown is supported in this property.
   */
  title?: string

  /**
   * Some text that describes the slide. Markdown is supported in this property.
   */
  description?: string

  /**
   * The source of the slide, for example a HTTP URL. Markdown is supported in
   * this property.
   */
  source?: string
}

/**
 * A slide.
 */
export interface Slide {
  /**
   * A deep copy of the raw slide data.
   */
  rawData: any

  /**
   * The slide number
   */
  no: number

  /**
   * The additional meta data of a slide.
   */
  meta: SlideMeta

  /**
   * The corresponding master slide.
   */
  master: Master

  /**
   * The normalized slide data. This data gets passed through the master slide
   * and then to the props of the Vue components.
   */
  props: StringObject

  /**
   * Props (properties) to send to the main Vue master component.
   */
  propsMain?: StringObject

  /**
   * Props (properties) to send to the preview Vue master component.
   */
  propsPreview?: StringObject

  /**
   * A list of media URIs.
   */
  mediaUris?: Set<string>

  /**
   * Media URIs that do not have to exist.
   */
  optionalMediaUris?: Set<string>

  /**
   * How many steps the slide provides.
   */
  stepCount?: number

  /**
   * The current step number. The first number is 1 not 0.
   */
  stepNo?: number

  /**
   * Css properties in camelCase for the style property of the vue js
   * render function.
   *
   * ```yml
   * - title: Different background color
   *   task: Background color blue
   *   style:
   *     background_color: $green;
   *     color: $blue;
   *     font_size: 8vw
   *     font_weight: bold
   * ```
   *
   * @see {@link https://vuejs.org/v2/guide/class-and-style.html#Object-Syntax-1}
   *
   * @type {Object}
   */
  // style: StringIndexedObject

  /**
   * The level in the hierarchial slide tree.
   */
  level: number

  /**
   * The scale factor of the current slide. This factor is used to set
   * the font size of parent HTML container. All visual elements of the slide
   * have to react on different font sizes to get a scale factor.
   */
  // scaleFactor: number

  /**
   * A list of child slides.
   */
  slides: Slide[]
}

/**
 * The meta informations of a presentation file.
 *
 * ```yaml
 * meta:
 *   ref: An unique reference string
 *   uuid: 75bd3ec8-a322-477c-ad7a-5915513f9dd8
 *   title: A title
 *   sub_title: A subtitle
 *   grade: The grade the presentation belongs to.
 *   curriculum: Relation to the curriculum.
 *   curriculum_url: http://curriculum.com
 * ```
 */
export interface PresentationMeta {
  /**
   * A reference string to identify the presentation (for example: `Wiener-Klassik`)
   */
  ref: string

  /**
   * A Universally Unique Identifier to identify the presentation.
   */
  uuid?: string

  /**
   * The title of the presentation. (for example: `Das orchestrale Klangbild bei Beethoven`)
   */
  title: string

  /**
   * The subtitle of the presentation in the form: `<em class="person">Composer</em>: <em class="piece">Piece</em> (year)`.
   * (for example: `<em class="person">Ludwig van Beethoven</em>: <em class="piece">Sinfonie Nr. 8 F-Dur op. 93</em> (1812)`)
   */
  subtitle?: string

  /**
   * The grade the presentation belongs to. (for example: `11`)
   */
  grade: number

  /**
   * Relation to the curriculum. (for example: `Klangkörper im Wandel / Das Klangbild der Klassik`)
   */
  curriculum: string

  /**
   * URL of the curriculum web page. (for example: `https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/5/musik`)
   */
  curriculumUrl?: string
}

/**
 * The type of the YAML file format of a presentation `Praesentation.baldr.yml`
 */
export interface FileFormat {
  meta?: PresentationMeta
  slides: object
}

/**
 * A presentation is represented by the YAML file `Praesentation.baldr.yml`.
 * A presentation contains slides and meta data.
 */
export interface Presentation {
  /**
   * The meta informations of a presentation file.
   */
  meta: PresentationMeta

  /**
   * A flat list of slide objects. All child slides are included in this array.
   */
  slides: Slide[]

  /**
   * Only the top level slide objects are included in this array. Child slides
   * can be accessed under the `slides` property of the Slide instances.
   */
  slidesTree: Slide[]
}
