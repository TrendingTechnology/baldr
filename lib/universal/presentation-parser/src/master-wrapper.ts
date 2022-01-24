/**
 * Provide the class “Master”.
 */

import { Resolver } from '@bldr/media-resolver'
import {
  convertNestedMarkdownToHtml,
  convertMarkdownToHtml
} from '@bldr/markdown-to-html'
import { MediaUri } from '@bldr/client-media-models'

import { Slide } from './slide'
import { StepCollector } from './step'
import { Fields, FieldDefinitionCollection } from './field'
import { MasterIconSpec, MasterSpec } from './master-specification'

type MasterConstructor = new () => MasterSpec

/**
 * The icon of a master slide. This icon is shown in the documentation or
 * on the left corner of a slide.
 */
class MasterIcon implements MasterIconSpec {
  name: string
  color: string
  size: 'large' | 'small'
  showOnSlides: boolean
  unicodeSymbol?: string

  constructor ({
    name,
    color,
    size,
    showOnSlides,
    unicodeSymbol
  }: MasterIconSpec) {
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
    this.unicodeSymbol = unicodeSymbol
  }
}

/**
 * Wraps a master specification object. Processes, hides, forwards the field
 * data of the slides and methods.
 */
export class Master {
  private readonly master: MasterSpec

  public icon: MasterIcon
  constructor (MasterClass: MasterConstructor) {
    this.master = new MasterClass()
    this.icon = new MasterIcon(this.master.icon)
  }

  public get fieldsDefintion (): FieldDefinitionCollection {
    return this.master.fieldsDefintion
  }

  public get name (): string {
    return this.master.name
  }

  public get displayName (): string {
    return this.master.displayName
  }

  /**
   * A description text in HTML format.
   */
  public get description (): string | undefined {
    if (this.master.description != null) {
      return convertMarkdownToHtml(this.master.description)
    }
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

  public processMediaUris (fields?: Fields): Set<string> {
    if (this.master.collectMediaUris != null && fields != null) {
      return Master.processMediaUris(
        this.master.collectMediaUris(fields)
      )
    }
    return new Set<string>()
  }

  public processOptionalMediaUris (fields?: Fields): Set<string> {
    if (this.master.collectOptionalMediaUris != null && fields != null) {
      return Master.processMediaUris(
        this.master.collectOptionalMediaUris(fields)
      )
    }
    return new Set<string>()
  }

  public collectStepsOnInstantiation (
    fields: Fields,
    stepCollector: StepCollector
  ): void {
    if (this.master.collectStepsOnInstantiation != null) {
      this.master.collectStepsOnInstantiation(fields, stepCollector)
    }
  }

  generateTexMarkup (fields: Fields): string | undefined {
    if (this.master.generateTexMarkup != null) {
      return this.master.generateTexMarkup(fields)
    }
  }

  /**
   * Before resolving
   */
  public initializeFields (fields: Fields): Fields {
    if (this.master.shortFormField != null && typeof fields === 'string') {
      const shortform = fields
      fields = {}
      fields[this.master.shortFormField] = shortform
    }
    if (this.master.normalizeFieldsInput != null) {
      fields = this.master.normalizeFieldsInput(fields)
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

    if (this.master.collectFieldsOnInstantiation != null) {
      fields = this.master.collectFieldsOnInstantiation(fields)
    }
    return fields
  }

  /**
   * After the media resolution.
   */
  public finalizeSlide (
    slide: Slide,
    resolver: Resolver
  ): Fields | undefined {
    if (this.master.collectFieldsAfterResolution != null) {
      const fields = this.master.collectFieldsAfterResolution(
        slide.fields,
        resolver
      )
      slide.fields = fields
    }

    if (this.master.collectStepsAfterResolution != null) {
      this.master.collectStepsAfterResolution(slide.fields, slide)
    }
    return slide.fields
  }

  public deriveTitleFromFields (fields: any): string | undefined {
    if (this.master.deriveTitleFromFields != null) {
      return this.master.deriveTitleFromFields(fields)
    }
  }

  public derivePlainTextFromFields (fields: any): string | undefined {
    if (this.master.derivePlainTextFromFields != null) {
      return this.master.derivePlainTextFromFields(fields)
    }
    const segments = []
    for (const fieldName in fields) {
      if (Object.prototype.hasOwnProperty.call(fields, fieldName)) {
        const value = fields[fieldName]
        if (typeof value === 'string') {
          segments.push(value)
        }
      }
    }
    if (segments.length > 0) {
      return segments.join(' | ')
    }
  }
}
