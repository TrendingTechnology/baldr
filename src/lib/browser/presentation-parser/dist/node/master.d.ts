import { Resolver } from '@bldr/media-resolver-ng';
import { Slide } from './slide';
import { StepCollector } from './step';
export { convertMarkdownToHtml } from '@bldr/markdown-to-html';
export { Asset, Sample } from '@bldr/media-resolver-ng';
export { convertHtmlToPlainText } from '@bldr/core-browser';
export { buildTextStepController, wrapWords } from '@bldr/dom-manipulator';
export { StepCollector } from './step';
export { extractUrisFromFuzzySpecs, WrappedUri, WrappedUriList } from './fuzzy-uri';
export { Resolver } from '@bldr/media-resolver-ng';
export { Slide } from './slide';
/**
 * Some data indexed by strings
 */
export interface FieldData {
    [fieldName: string]: any;
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
    default?: any;
    /**
     * Text to describe the property. A descriptive text shown in the
     * documentation.
     */
    description?: string;
    /**
     * Indicates that this `prop` is text for extracting inline media URIs
     * like `[id:Beethoven_Ludwig-van]`.
     */
    inlineMarkup?: boolean;
    /**
     * The specified value can contain markup. The value can be written in
     * Markdown and or in HTML. Markdown is converted into HTML. The key
     * `type` has to be `String`.
     */
    markup?: boolean;
    /**
     * Indicates that this `field` contains a media file URI.
     */
    assetUri?: boolean;
    /**
     * Must be specifed.
     */
    required?: boolean;
    /**
     * The same as Vue `type`.
     */
    type?: object;
    /**
     * A function to validate the input. Return false if the input is not valid.
     */
    validate?: (input: any) => boolean;
}
declare type StepFieldNames = 'selector' | 'mode' | 'subset';
interface FieldDefinitionCollection {
    [key: string]: FieldDefinition;
}
/**
 * Map step support related fields.
 *
 * @param selectors - At the moment: “selector”, “mode” and “subset”.
 */
export declare function mapStepFieldDefintions(selectors: StepFieldNames[]): FieldDefinitionCollection;
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
    name: string;
    /**
     * A color name (CSS color class name) to colorize the master icon.
     * @see {@link module:@bldr/themes}
     */
    color?: string;
    /**
     * The size of a master icon: `small` or `large`.
     */
    size?: 'large' | 'small';
    /**
     * Show the icon on the slide view.
     */
    showOnSlides?: boolean;
}
export interface Master {
    /**
     * The name of the master slide. A short name in lower case letters like `audio`.
     */
    name: string;
    /**
     * A human readable name of the master slide.
     */
    displayName: string;
    icon: MasterIconSpec;
    /**
     * The defintion of the fields of the master slide.
     */
    fieldsDefintion: {
        [key: string]: FieldDefinition;
    };
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
    shortFormField?: string;
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
    normalizeFieldsInput?: (rawFieldsInput: any) => FieldData;
    /**
     * Collect the fields of a slide during the instantiation of the slide
     * objects.
     */
    collectFieldsOnInstantiation?: (fieldsInput: any) => FieldData;
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
    collectMediaUris?: (fields: any) => string | string[] | Set<string> | undefined;
    /**
     * Check if the handed over media URIs can be resolved. Throw no errors, if
     * the media assets are not present. This hook is used in the YouTube master
     * slide. This master slide uses the online version, if no offline video could
     * be resolved.
     */
    collectOptionalMediaUris?: (fields: any) => string | string[] | Set<string> | undefined;
    /**
     * Collect the steps before the media resolution.
     *
     * ```ts
     * collectStepsOnInstantiation (
     *   fields: CounterInstantiated,
     *   stepCollection: StepCollector
     * ): void {
     *   for (const counterElement of fields.counterElements) {
     *     stepCollection.add(`Zähle „${counterElement}“`)
     *   }
     * }
     * ```
     *
     * @param fields - Fields type: `..Instantiated`.
     * @param stepCollector - Use `stepCollector.add()` to add one step.
     */
    collectStepsOnInstantiation?: (fields: any, stepCollector: StepCollector) => void;
    /**
     * Collect the fields of a slide after the media resolution is completed.
     */
    collectFieldsAfterResolution?: (fields: any, resolver: Resolver) => FieldData;
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
    collectStepsAfterResolution?: (fields: any, slide: Slide) => void;
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
    generateTexMarkup?: (payload: any) => string;
}
declare type MasterConstructor = new () => Master;
/**
 * The icon of a master slide. This icon is shown in the documentation or
 * on the left corner of a slide.
 */
declare class MasterIcon implements MasterIconSpec {
    name: string;
    color: string;
    size: 'large' | 'small';
    showOnSlides: boolean;
    constructor({ name, color, size, showOnSlides }: MasterIconSpec);
}
/**
 * Wraps a master object. Processes, hides, forwards the field data of the
 * slides and methods.
 */
export declare class MasterWrapper {
    private readonly master;
    icon: MasterIcon;
    constructor(MasterClass: MasterConstructor);
    get name(): string;
    /**
     * Convert to a set and remove sample fragments, e. g. `#complete`
     */
    private static processMediaUris;
    processMediaUris(fields?: FieldData): Set<string>;
    processOptionalMediaUris(fields?: FieldData): Set<string>;
    collectStepsOnInstantiation(fields: FieldData, stepCollector: StepCollector): void;
    generateTexMarkup(fields: FieldData): string | undefined;
    /**
     * Before resolving
     */
    initializeFields(fields: FieldData): FieldData;
    /**
     * After the media resolution.
     */
    finalizeSlide(slide: Slide, resolver: Resolver): FieldData | undefined;
}
