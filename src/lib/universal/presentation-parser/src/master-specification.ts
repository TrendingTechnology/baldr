/**
 * Bundle many exports so that the individual master slides can import them from
 * one module.
 */

// Imports
import { Resolver } from '@bldr/media-resolver-ng'

import { Slide } from './slide'
import { StepCollector } from './step'
import { FieldData, FieldDefinitionCollection } from './field'

// Exports
export { convertMarkdownToHtml } from '@bldr/markdown-to-html'
export { Asset, Sample, Resolver } from '@bldr/media-resolver-ng'
export { convertHtmlToPlainText, shortenText } from '@bldr/string-format'
export {
  buildTextStepController,
  wrapWords,
  splitHtmlIntoChunks
} from '@bldr/dom-manipulator'

export { mapStepFieldDefintions, FieldData } from './field'
export {
  extractUrisFromFuzzySpecs,
  WrappedUri,
  WrappedUriList
} from './fuzzy-uri'
export { Slide } from './slide'
export { StepCollector } from './step'

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
export interface MasterIconSpec {
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

  /**
   * A unicode symbol (emoji) to imitate the SVG icon in the text console.
   */
  unicodeSymbol?: string
}

/**
 * An interface that must be implemented by all master slides. This class
 * spezifies how a master slide must be constructed.
 */
export interface MasterSpec {
  /**
   * The name of the master slide. A short name in lower case letters like
   * `audio`.
   */
  name: string

  /**
   * A human readable name of the master slide.
   */
  displayName: string

  /**
   * A description text in Markdown format that is displayed on the
   * documentation page.
   */
  description?: string

  icon: MasterIconSpec

  /**
   * The defintion of the fields of the master slide.
   */
  fieldsDefintion: FieldDefinitionCollection

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
   * Normalize the row input of each slide. The result must correspond to the
   * fields definition.
   *
   * ```ts
   * normalizeFieldsInput (rawFieldsInput: MasterNameRawInput): MasterNameInput {
   *   if (typeof rawFieldsInput === 'string') {
   *     return {
   *       markup: rawFieldsInput
   *     }
   *   }
   * }
   * ```
   */
  normalizeFieldsInput?: (rawFieldsInput: any) => FieldData

  /**
   * Collect the fields of a slide during the instantiation of the slide
   * objects.
   */
  collectFieldsOnInstantiation?: (fieldsInput: any) => FieldData

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
   * Collect the steps before the media resolution.
   *
   * ```ts
   * collectStepsOnInstantiation (
   *   fields: CounterInstantiated,
   *   stepCollector: StepCollector
   * ): void {
   *   for (const counterElement of fields.counterElements) {
   *     stepCollector.add(`Zähle „${counterElement}“`)
   *   }
   * }
   * ```
   *
   * @param fields - Fields type: `..Instantiated`.
   * @param stepCollector - Use `stepCollector.add()` to add one step.
   */
  collectStepsOnInstantiation?: (
    fields: any,
    stepCollector: StepCollector
  ) => void

  /**
   * Collect the fields of a slide after the media resolution is completed.
   */
  collectFieldsAfterResolution?: (fields: any, resolver: Resolver) => FieldData

  /**
   * Collect the steps after the media resolution.
   *
   * ```ts
   * collectStepsAfterResolution (fields: SampleListFieldsNormalized, slide: Slide): void {
   *   for (const wrappedUri of fields.samples) {
   *     const title = wrappedUri.title != null ? wrappedUri.title : wrappedUri.uri
   *     slide.stepCollector.add(title)
   *   }
   * }
   * ```
   */
  collectStepsAfterResolution?: (fields: any, slide: Slide) => void

  /**
   * Determine a title from the slide fields.
   *
   * ```ts
   * deriveTitleFromFields (fields: GenericFieldsResolved) {
   *
   * }
   *  ```
   */
  deriveTitleFromFields?: (fields: any) => string

  derivePlainTextFromFields?: (fields: any) => string

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
