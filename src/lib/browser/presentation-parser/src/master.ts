import { Resolver as ResolverType } from '@bldr/media-resolver-ng'
import { convertNestedMarkdownToHtml } from '@bldr/markdown-to-html'
import { MediaUri } from '@bldr/client-media-models'
import { Slide } from './slide'
import { Step } from './step'

export { convertMarkdownToHtml } from '@bldr/markdown-to-html'
export { Asset, Sample } from '@bldr/media-resolver-ng'
export { convertHtmlToPlainText } from '@bldr/core-browser'
export { buildTextStepController, wrapWords } from '@bldr/dom-manipulator'
export { Step } from './step'
export { extractUrisFromFuzzySpecs, WrappedUri, WrappedUriList } from './fuzzy-uri'

export type Resolver = ResolverType

/**
 * Some data indexed by strings
 */
export interface FieldData {
  [fieldName: string]: any
}

/**
 * We name the properties of a master slide “field” to better distinguish them
 * from the Vue properties “props”. It is an extended version of the Vue `props` defintion.
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
   * Indicates that this `field` contains a media file URI.
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

  /**
   * A function to validate the input. Return false if the input is not valid.
   */
  validate?: (input: any) => boolean
}

type StepFieldNames = 'selector' | 'mode' | 'subset'

interface FieldDefinitionCollection {
  [key: string]: FieldDefinition
}

const stepFieldDefinitions: FieldDefinitionCollection = {
  selector: {
    description:
      'Selektor, der Elemente auswählt, die als Schritte eingeblendet werden sollen.'
  },
  mode: {
    type: String,
    description: '„words“ oder „sentences“'
  },
  subset: {
    type: String,
    description:
      'Eine Untermenge von Schritten auswählen (z. B. 1,3,5 oder 2-5).'
  }
}

/**
 * Map step support related fields.
 *
 * @param selectors - At the moment: “selector”, “mode” and “subset”.
 */
export function mapStepFieldDefintions (
  selectors: StepFieldNames[]
): FieldDefinitionCollection {
  const result: FieldDefinitionCollection = {}
  for (const selector of selectors) {
    if (stepFieldDefinitions[selector] != null) {
      result[
        `step${selector.charAt(0).toUpperCase()}${selector
          .substr(1)
          .toLowerCase()}`
      ] = stepFieldDefinitions[selector]
    }
  }
  return result
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

export interface Master {
  /**
   * The name of the master slide. A short name in lower case letters like `audio`.
   */
  name: string

  /**
   * A human readable name of the master slide.
   */
  displayName: string

  icon: MasterIconSpec

  /**
   * The defintion of the fields of the master slide.
   */
  fieldsDefintion: {
    [key: string]: FieldDefinition
  }

  /**
   * ```yml
   * - audio: ref:./Fuer-Elise.jpg
   * ```
   *
   * ```yml
   * - audio:
   *     src: ref:./Fuer-Elise.jpg
   * ```
   *
   * ```js
   * this.shortform = 'src'
   * ```
   */
  shortFormField?: string

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
  normalizeFields?: (fields: any) => FieldData

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
  collectMediaUris?: (
    fields: any
  ) => string | string[] | Set<string> | undefined

  /**
   * Check if the handed over media URIs can be resolved. Throw no errors, if
   * the media assets are not present. This hook is used in the YouTube master
   * slide. This master slide uses the online version, if no offline video could
   * be resolved.
   */
  collectOptionalMediaUris?: (
    fields: any
  ) => string | string[] | Set<string> | undefined

  /**
   * After media resolution
   */
  collectFields?: (fields: any, resolver: Resolver) => FieldData

  collectSteps?: (fields: any) => Step[]

  /**
   * Collect the steps after the media resolution.
   */
  collectStepsLate?: (fields: any) => Step[]

  /**
   * Generate TeX markup from the current slide. See TeX package
   * `schule-baldr.dtx`.
   *
   * ```js
   * import * as tex from '@bldr/tex-templates'
   *
   * export class GenericMaster extends Master {
   *   generateTexMarkup ({ props, propsMain, propsPreview }) {
   *     const yaml = propsMain.asset.yaml
   *     return tex.environment('baldrPerson', yaml.shortBiography, {
   *       name: yaml.name
   *     })
   *   }
   * }
   * ```
   */
  generateTexMarkup?: (payload: any) => string
}

type MasterConstructor = new () => Master

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
 * Wraps a master object. Processes, hides, forwards the field data of the
 * slides and methods.
 */
export class MasterWrapper {
  private readonly master: Master

  public icon: MasterIcon
  constructor (MasterClass: MasterConstructor) {
    this.master = new MasterClass()
    this.icon = new MasterIcon(this.master.icon)
  }

  public get name (): string {
    return this.master.name
  }

  /**
   * Convert to a set and remove sample fragments, e. g. `#complete`
   */
  private static processMediaUris (
    uris: string | string[] | Set<string> | undefined
  ): Set<string> {
    const result = new Set<string>()
    if (uris == null) {
      return result
    }
    if (typeof uris === 'string') {
      uris = [uris]
    }
    for (const uri of uris) {
      result.add(MediaUri.removeFragment(uri))
    }
    return result
  }

  public processMediaUris (fields?: FieldData): Set<string> {
    if (this.master.collectMediaUris != null && fields != null) {
      return MasterWrapper.processMediaUris(
        this.master.collectMediaUris(fields)
      )
    }
    return new Set<string>()
  }

  public processOptionalMediaUris (fields?: FieldData): Set<string> {
    if (this.master.collectOptionalMediaUris != null && fields != null) {
      return MasterWrapper.processMediaUris(
        this.master.collectOptionalMediaUris(fields)
      )
    }
    return new Set<string>()
  }

  generateTexMarkup (fields: FieldData): string | undefined {
    if (this.master.generateTexMarkup != null) {
      return this.master.generateTexMarkup(fields)
    }
  }

  /**
   * Before resolving
   */
  public initializeFields (fields: FieldData): FieldData {
    if (this.master.shortFormField != null && typeof fields === 'string') {
      const shortform = fields
      fields = {}
      fields[this.master.shortFormField] = shortform
    }
    if (this.master.normalizeFields != null) {
      fields = this.master.normalizeFields(fields)
    }
    for (const name in fields) {
      // Raise an error if there is an unknown field.
      if (this.master.fieldsDefintion[name] == null) {
        throw new Error(
          `The master slide “${this.master.name}” has no field named “${name}”.`
        )
      }
    }

    for (const name in this.master.fieldsDefintion) {
      const def = this.master.fieldsDefintion[name]

      if (def.required != null && def.required && fields[name] == null) {
        throw new Error(
          `A field named “${name}” is mandatory for the master slide “${this.master.name}”.`
        )
      }

      // Set default values
      if (def.default != null && fields[name] == null) {
        fields[name] = def.default
      }

      // type
      if (
        def.type != null &&
        typeof def.type === 'function' &&
        fields[name] != null
      ) {
        fields[name] = def.type(fields[name])
      }

      //  Convert the field marked as containing markup from markdown to HTML.
      if (def.markup != null && def.markup && fields[name] != null) {
        fields[name] = convertNestedMarkdownToHtml(fields[name])
      }
    }
    return fields
  }

  /**
   * After resolving
   */
  public finalizeFields (
    slide: Slide,
    resolver: Resolver
  ): FieldData | undefined {
    if (this.master.collectFields != null) {
      const fields = this.master.collectFields(slide.fields, resolver)
      slide.fields = fields
      return fields
    }
  }
}
