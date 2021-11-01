/**
 * Some data indexed by strings
 */
export interface FieldData {
  [fieldName: string]: any
}

/**
 * We name the properties of a master slide “field” to better distinguish them
 * from the Vue properties “props”.
 * It is an extended version of the Vue `props` defintion.
 *
 * ```js
 *  const fields = {
 *    src: {
 *      default: 'ref:Fuer-Elise'
 *      description: 'Den URI zu einer Video-Datei.',
 *      inlineMarkup: false
 *      markup: false
 *      assetUri: true,
 *      required: true,
 *      type: String,
 *    }
 *  }
 * ```
 */
interface FieldDefinition {
  /**
   * A default value.
   */
  default?: any

  /**
   * Text to describe the property. A descriptive text shown in the
   * documentation.
   */
  description?: string

  /**
   * Indicates that this `prop` is text for extracting inline media URIs
   * like `[id:Beethoven_Ludwig-van]`.
   */
  inlineMarkup?: boolean

  /**
   * The specified value can contain markup. The value can be written in
   * Markdown and or in HTML. Markdown is converted into HTML. The key
   * `type` has to be `String`.
   */
  markup?: boolean

  /**
   * Indicates that this `prop` contains a media file URI.
   */
  assetUri?: boolean

  /**
   * Must be specifed.
   */
  required?: boolean

  /**
   * The same as Vue `type`.
   */
  type?: object
}

/**
 * Specification of the master slide icon that is normally displayed on the
 * top left corner of a slide.
 *
 * ```js
 * icon: {
 *   name: 'quote',
 *   color: 'brown',
 *   size: 'large'
 *   showOnSlides: true
 * }
 * ```
 */
interface MasterIconSpec {
  /**
   * For allowed icon names see the
   * {@link module:@bldr/icons Baldr icon font}.
   */
  name: string

  /**
   * A color name (CSS color class name) to colorize the master icon.
   * @see {@link module:@bldr/themes}
   */
  color?: string

  /**
   * The size of a master icon: `small` or `large`.
   */
  size?: 'large' | 'small'

  /**
   * Show the icon on the slide view.
   */
  showOnSlides?: boolean
}

export abstract class Master {
  /**
   * The name of the master slide. A short name in lower case letters like `audio`.
   */
  public abstract name: string

  /**
   * A human readable name of the master slide.
   */
  public abstract displayName: string

  public abstract icon: MasterIconSpec

  /**
   * The defintion of the fields of the master slide.
   */
  public fieldsDefintion?: {
    [key: string]: FieldDefinition
  }

  /**
   * The result must correspond to the fields definition.
   *
   * Called during the parsing the YAML file (`Praesentation.baldr.yml`)
   *
   * ```js
   * normalizeFields (fields) {
   *   if (typeof fields === 'string') {
   *     return {
   *       markup: fields
   *     }
   *   }
   * }
   * ```
   */
  public normalizeFields (fields: any): FieldData {
    return fields
  }

  /**
   * Retrieve the media URIs which have to be resolved.
   *
   * Call the master funtion `resolveMediaUris` and collect the media URIs.
   * (like [id:beethoven, ref:mozart]). Extract media URIs from
   * the text props.
   *
   * Called during the parsing the YAML file (`Praesentation.baldr.yml`).
   *
   * ```js
   * // An array of media URIs to resolve (like [id:beethoven, ref:mozart.mp3])
   * collectMediaUris (fields) {
   *   return fields.src
   * }
   * ```
   */
  public collectMediaUris (
    fields: FieldData
  ): string | string[] | Set<string> | undefined {
    return undefined
  }

  /**
   * Check if the handed over media URIs can be resolved. Throw no errors, if
   * the media assets are not present. This hook is used in the YouTube master
   * slide. This master slide uses the online version, if no offline video could
   * be resolved.
   */
  public collectOptionalMediaUris (
    fields: FieldData
  ): string | string[] | Set<string> | undefined {
    return undefined
  }
}

interface MasterConstructor {
  new (): Master
}

/**
 * The icon of a master slide. This icon is shown in the documentation or
 * on the left corner of a slide.
 */
class MasterIcon implements MasterIconSpec {
  name: string
  color: string
  size: 'large' | 'small'
  showOnSlides: boolean

  constructor ({ name, color, size, showOnSlides }: MasterIconSpec) {
    if (size != null && !['small', 'large'].includes(size)) {
      throw new Error(
        `The property “size” of the “MasterIcon” has to be “small” or “large” not ${size}`
      )
    }

    if (showOnSlides !== undefined && typeof showOnSlides !== 'boolean') {
      throw new Error(
        `The property “showOnSlide” of the “MasterIcon” has to be “boolean” not ${String(
          showOnSlides
        )}`
      )
    }

    this.name = name
    this.color = color != null ? color : 'orange'
    this.showOnSlides = showOnSlides != null ? showOnSlides : false
    this.size = size != null ? size : 'small'
  }
}

/**
 * Wraps a master object. Processes, hides, forwards the master data and
 * methods.
 */
export class MasterWrapper {
  private master: Master

  public icon: MasterIcon
  constructor (MasterClass: MasterConstructor) {
    this.master = new MasterClass()
    this.icon = new MasterIcon(this.master.icon)
  }

  public get name (): string {
    return this.master.name
  }

  public normalizeFields (fields: any): FieldData {
    return this.master.normalizeFields(fields)
  }

  private static convertToSet (
    uris: string | string[] | Set<string> | undefined
  ): Set<string> {
    if (uris == null) {
      return new Set<string>()
    }
    if (typeof uris === 'string') {
      return new Set([uris])
    } else if (Array.isArray(uris)) {
      return new Set(uris)
    }
    return uris
  }

  public processMediaUris (fields: FieldData): Set<string> {
    return MasterWrapper.convertToSet(this.master.collectMediaUris(fields))
  }

  public processOptionalMediaUris (fields: FieldData): Set<string> {
    return MasterWrapper.convertToSet(
      this.master.collectOptionalMediaUris(fields)
    )
  }
}
