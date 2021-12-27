/**
 * Some data indexed by strings
 */
export interface StringIndexedData {
    [propName: string]: any;
}
/**
 * The
 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call thisArg}
 * a function is called with.
 */
declare type ThisArg = object;
export interface PropsAndMaster {
    props: StringIndexedData;
    master: Master;
}
export interface PropsAndSlide {
    props: StringIndexedData;
    propsMain: StringIndexedData;
    slide: object;
}
export interface PropsSlideAndMaster extends PropsAndSlide {
    propsPreview: StringIndexedData;
    master: object;
}
export interface PropsBundle {
    props: StringIndexedData;
    propsMain: StringIndexedData;
    propsPreview: StringIndexedData;
}
export interface OldAndNewPropsAndSlide {
    oldSlide: object;
    oldProps: StringIndexedData;
    newSlide: object;
    newProps: StringIndexedData;
}
export interface OldAndNewSlideNos {
    oldSlideNo?: number;
    newSlideNo: number;
}
export interface OldAndNewStepNo {
    oldStepNo?: number;
    newStepNo: number;
}
export interface OldAndNewStepNoAndSlideNoChange extends OldAndNewStepNo {
    slideNoChange: boolean;
}
/**
 * Hooks (exported master methods)
 *
 * The hooks are listed in call order.
 */
interface MasterHooks {
    /**
     * Called during the parsing the YAML file (`Praesentation.baldr.yml`)
     *
     * ```js
     * export const default = {
     *   hooks: {
     *     // result must fit to props
     *     normalizeProps (props) {
     *       if (typeof props === 'string') {
     *         return {
     *           markup: props
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     */
    normalizeProps?: (props: any) => StringIndexedData;
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
     * export const default = {
     *   hooks: {
     *     // An array of media URIs to resolve (like [id:beethoven, ref:mozart.mp3])
     *     resolveMediaUris (props) {
     *       return props.src
     *     }
     *   }
     * }
     * ```
     */
    resolveMediaUris?: (props: StringIndexedData) => string | string[] | Set<string>;
    /**
     * Check if the handed over media URIs can be resolved. Throw no errors, if
     * the media assets are not present. This hook is used in the YouTube master
     * slide. This master slide uses the online version, if no offline video
     * could be resolved. Called during the parsing the YAML file
     * (`Praesentation.baldr.yml`).
     *
     * ```js
     * export const default = {
     *   hooks: {
     *     // An array of media URIs to resolve (like [id:beethoven, ref:mozart.mp3])
     *     resolveOptionalMediaUris (props) {
     *       return props.src
     *     }
     *   }
     * }
     * ```
     */
    resolveOptionalMediaUris?: (props: StringIndexedData) => string | string[];
    /**
     * This hook after is called after loading. To load resources in the
     * background. Goes in the background. Called during the parsing the YAML file
     * (`Praesentation.baldr.yml`).
     *
     * - `this`: is the main Vue instance.
     *
     * ```js
     * export const default = {
     *   hooks {
     *     async afterLoading ({ props, master }) {
     *       const body = await getHtmlBody(props.title, props.language)
     *       master.$commit('addBody', { ref: formatId(props.language, props.title), body: body })
     *     }
     *   }
     * }
     * ```
     */
    afterLoading?: (payload: PropsAndMaster) => Promise<void>;
    /**
     * This hook gets executed after the media resolution. All media assets are
     * resolved and stored in the corresponding caches. This hook does not go into
     * the background. `afterMediaResolution` is called during the parsing the
     * YAML file (`Praesentation.baldr.yml`).
     *
     * - `this`: is the main Vue instance.
     *
     * ```js
     * export const default = {
     *   hooks {
     *     async afterMediaResolution ({ props, master }) {
     *       const svg = master.$get('svgByUri')(props.src)
     *       if (!svg) {
     *         const mediaAsset = this.$store.getters['media/assetByUri'](props.src)
     *         const response = await this.$media.httpRequest.request({
     *           url: `/media/${mediaAsset.path}`,
     *           method: 'get'
     *         })
     *         if (response.data) {
     *           master.$commit('addSvg', { uri: props.src, markup: response.data })
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     */
    afterMediaResolution?: (payload: PropsAndMaster) => Promise<void>;
    /**
     * Collect the props (properties) for the main Vue component.
     *
     * - `this`: is the main Vue instance.
     * - `return`: an object.
     *
     * ```js
     * export const default = {
     *   collectPropsMain (props) {
     *     const asset = this.$store.getters['media/assetByUri'](props.src)
     *     return {
     *       src: props.src,
     *       svgPath: asset.path,
     *       svgTitle: asset.title,
     *       svgHttpUrl: asset.httpUrl,
     *       stepSelector: props.stepSelector,
     *       stepSubset: props.stepSubset
     *     }
     *   }
     * }
     * ```
     */
    collectPropsMain?: (props: StringIndexedData) => StringIndexedData;
    /**
     * Collect the props (properties) for the preview Vue component. Called
     * during the parsing the YAML file (`Praesentation.baldr.yml`).
     *
     * - `this`: is the main Vue instance.
     *
     * ```js
     * export const default = {
     *   hooks: {
     *     collectPropsPreview({ props, propsMain, slide }) {
     *       return props.src.length
     *     }
     *   }
     * }
     * ```
     */
    collectPropsPreview?: (payload: PropsAndSlide) => StringIndexedData;
    /**
     * Calculate from the given props the step count. This hook method is called
     * after media resolution. Called during the parsing the YAML file
     * (`Praesentation.baldr.yml`).
     *
     * - `this`: is the main Vue instance.
     * - `return`: a number or an array of slide steps.
     *
     * ```js
     * export const default = {
     *   hooks: {
     *     calculateStepCount ({ props, propsMain, propsPreview, slide }) {
     *       return props.src.length
     *     }
     *   }
     * }
     * ```
     */
    calculateStepCount?: (payload: PropsSlideAndMaster) => number;
    /**
     * Determine a title from the properties. Getter on the slide object.
     *
     * ```js
     * export const default = {
     *   hooks: {
     *     titleFromProps ({ props, propsMain }) {
     *       if (props.title) return props.title
     *       const asset = propsMain.mediaAsset
     *       if (asset.title) return asset.title
     *     }
     *   }
     * }
     *  ```
     */
    titleFromProps?: (payload: PropsBundle) => string;
    /**
     * Generate a TeX markup from the current slide. See TeX package
     * `schule-baldr.dtx`.
     *
     * ```js
     * import * as tex from '@bldr/tex-templates'
     *
     * export const default = {
     *   hooks: {
     *     generateTexMarkup ({ props, propsMain, propsPreview }) {
     *       const yaml = propsMain.asset.yaml
     *       return tex.environment('baldrPerson', yaml.shortBiography, {
     *         name: yaml.name
     *       })
     *     }
     *   }
     * }
     * ```
     */
    generateTexMarkup?: (payload: PropsBundle) => string;
    /**
     * Extract a plain text from the props (properties) of a slide. Getter on
     * the slide object.
     *
     * - `return`: a string
     *
     * ```js
     * export const default = {
     *   hooks: {
     *     plainTextFromProps (props) {
     *       const output = []
     *       for (const markup of props.markup) {
     *         output.push(convertHtmlToPlainText(markup))
     *       }
     *       return output.join(' | ')
     *     }
     *   }
     * }
     * ```
     */
    plainTextFromProps?: (props: StringIndexedData) => string;
    /**
     * Called when leaving a slide. This hook is triggered by the Vue lifecycle
     * hook `beforeDestroy`.
     *
     * ```js
     * export const default = {
     *   hooks: {
     *     leaveSlide ({ oldSlide, oldProps, newSlide, newProps }) {
     *     }
     *   }
     * }
     *
     * ```
     */
    leaveSlide?: (payload: OldAndNewPropsAndSlide) => void;
    /**
     * Called when entering a slide. This hook is only called on the public master
     * component (the one that is visible for the audience), not on further
     * secondary master components (for example the ad hoc slides or the future
     * slide view in the speakers view.)
     *
     * - `this`: is the Vue instance of the current main master component.
     * - called from within the Vuex store in the file  `store.js`.
     *
     * ```js
     * export const default = {
     *   hooks: {
     *     enterSlide ({ oldSlide, oldProps, newSlide, newProps }) {
     *     }
     *   }
     * }
     * ```
     */
    enterSlide?: (payload: OldAndNewPropsAndSlide) => void;
    /**
     * Called when leaving a step. This hook is only called on the public master
     * component (the one that is visible for the audience), not on further
     * secondary master components (for example the ad hoc slides or the future
     * slide view in the speakers view.)
     *
     * - `this`: is the Vue instance of the current main master component.
     * - called from the Vuex action `setStepNoCurrent` in the file `store.js`.
     *
     * ```js
     * export const default = {
     *   hooks: {
     *     leaveStep ({ oldStepNo, newStepNo }) {
     *     }
     *   }
     * }
     * ```
     */
    leaveStep?: (payload: OldAndNewStepNo) => void;
    /**
     * Called when entering a step. This hook is only called on the public
     * master component (the one that is visible for the audience), not on
     * further secondary master components (for example the ad hoc slides or the
     * future slide view in the speakers view.)
     *
     * - `this`: is the Vue instance of the current main master component.
     * - called from the Vuex action `setStepNoCurrent` in the file `store.js`.
     *
     * ```js
     * export const default = {
     *   hooks: {
     *     enterStep ({ oldStepNo, newStepNo }) {
     *       if (this.stepMode) {
     *         this.domSteps.displayByNo({
     *           oldStepNo,
     *           stepNo: this.stepNo
     *         })
     *       }
     *     }
     *   }
     * }
     * ```
     */
    enterStep?: (payload: OldAndNewStepNo) => void;
    /**
     * To allows access of the functions using the bracket notation with strings.
     */
    [key: string]: Function | any;
}
/**
 * An extended version of the Vue `props` defintion.
 * Additional `props` keys (in comparison to the Vue props)
 *
 * ```js
 *  const props = {
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
export interface MasterProp {
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
     * Indicates that this `prop` contains a media file URI.
     */
    assetUri?: boolean;
    /**
     * Must be specifed.
     */
    required?: boolean;
    /**
     * The same as Vue `type`.
     */
    type?: Function | Function[];
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
export interface MasterIconSpec {
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
export interface StyleConfig {
    centerVertically?: boolean;
    /**
     * ```html
     * <body b-dark-mode="true"></body>
     * ```
     */
    darkMode?: boolean;
    /**
     *
     */
    contentTheme?: string;
    /**
     *
     */
    uiTheme?: string;
}
export interface PropsDefintion {
    [key: string]: MasterProp;
}
interface Store {
    state: object;
    getters?: object;
    actions?: object;
    mutations?: object;
}
/**
 * Interface for the specification of a master. This Interface has to be
 * implemented by the master slides.
 */
export interface MasterSpec {
    /**
     * The short name of the master slide. Should be a shorter string without
     * spaces in the camelCase format.
     */
    name: string;
    /**
     * The human readable title of the master slide.
     */
    title: string;
    icon: MasterIconSpec;
    styleConfig: StyleConfig;
    /**
     * The properties of the master slide.
     */
    propsDef?: PropsDefintion;
    /**
     * A collection of the master hooks (exported master methods.)
     */
    hooks?: MasterHooks;
    /**
     * A vuex object containing `state`, `getters`, `actions`, `mutations`
     * properties which buildes a submodule vuex store for each master.
     */
    store?: Store;
}
interface MasterIcon extends MasterIconSpec {
}
/**
 * Each master slide has an instance of this class.
 */
export interface Master {
    /**
     * A instance of `MasterIcon` which holds information about the master icon.
     */
    icon: MasterIcon;
    /**
     * Some markdown formated string to document this master slide.
     */
    documentation?: string;
    /**
     * The short name of the master slide. Should be a shorter string without
     * spaces in the camelCase format.
     */
    name: string;
    /**
     * The human readable title of the master slide.
     */
    title: string;
    /**
     * The name of the props which are supporting inline media (for example
     * `markup`)
     */
    propNamesInlineMedia: string[];
    /**
     * The properties of the master slide.
     */
    propsDef?: PropsDefintion;
    /**
     * Convert in the props certain strings containing markup to HTML.
     */
    convertMarkdownToHtml: (props: StringIndexedData) => StringIndexedData;
    /**
     * Raise an error if there is an unkown prop - a not in the `props` section
     * defined prop.
     */
    detectUnkownProps: (props: StringIndexedData) => void;
    /**
     * Validate all media file URIs in the props of a certain slide.
     */
    validateUris: (props: StringIndexedData) => StringIndexedData;
    /**
     * Normalize the properties so the result fits to props defintion of the
     * master slide.. Called during the parsing the YAML file
     * (`Praesentation.baldr.yml`)
     */
    normalizeProps: (propsRaw: any) => StringIndexedData;
    /**
     * Retrieve the media URIs which have to be resolved.
     *
     * Call the master funtion `resolveMediaUris` and collect the media URIs.
     * (like [id:beethoven, ref:mozart]). Extract media URIs from
     * the text props.
     */
    resolveMediaUris: (props: StringIndexedData) => Set<string> | undefined;
    /**
     * Check if the handed over media URIs can be resolved. Throw no errors, if
     * the media assets are not present. This hook is used in the YouTube master
     * slide. This master slide uses the online version, if no offline video could
     * be resolved. Called during the parsing the YAML file
     * (`Praesentation.baldr.yml`).
     */
    resolveOptionalMediaUris: (props: StringIndexedData) => Set<string> | undefined;
    /**
     * This hook after is called after loading. To load resources in the
     * background. Goes in the background. Called during the parsing the YAML file
     * (`Praesentation.baldr.yml`).
     *
     * - `this`: is the main Vue instance.
     *
     * @param props - The properties of the slide.
     */
    afterLoading: (props: StringIndexedData, thisArg: ThisArg) => void;
    /**
     * This hook gets executed after the media resolution. Wait for this hook to
     * finish. Go not in the background. Called during the parsing the YAML file
     * (`Praesentation.baldr.yml`). Blocks.
     *
     * - `this`: is the main Vue instance.
     *
     * @param props - The properties of the slide.
     */
    afterMediaResolution: (props: StringIndexedData, thisArg: ThisArg) => Promise<void>;
    /**
     * Collect the props (properties) for the main Vue component.
     *
     * @param props - The props of the master slide.
     *
     * @returns The props for the main component as a object.
     */
    collectPropsMain: (props: StringIndexedData, thisArg: ThisArg) => StringIndexedData;
    /**
     * Collect the props (properties) for the preview Vue component. Called
     * during the parsing the YAML file (`Praesentation.baldr.yml`).
     *
     * - `this`: is the main Vue instance.
     *
     * @returns The props for the preview component as a object.
     */
    collectPropsPreview: (payload: PropsAndSlide, thisArg: ThisArg) => StringIndexedData;
    /**
     * Calculate from the given props the step count. This hook method is called
     * after media resolution. Called during the parsing the YAML file
     * (`Praesentation.baldr.yml`).
     *
     * - `this`: is the main Vue instance.
     * - `return`: a number or an array of slide steps.
     *
     * @returns The steps count.
     */
    calculateStepCount: (payload: PropsSlideAndMaster, thisArg: ThisArg) => number;
    /**
     * Determine a title from the properties.
     */
    titleFromProps: (payload: PropsBundle) => string;
    /**
     * Extract a plain text from the props (properties) of a slide.
     */
    plainTextFromProps: (props: any) => string;
    /**
     * Called when leaving a slide. This hook is triggered by the Vue lifecycle
     * hook `beforeDestroy`.
     */
    leaveSlide: (payload: OldAndNewPropsAndSlide, thisArg: ThisArg) => void;
    /**
     * Called when entering a slide. This hook is only called on the public master
     * component (the one that is visible for the audience), not on further
     * secondary master components (for example the ad hoc slides or the future
     * slide view in the speakers view.)
     *
     * - `this`: is the Vue instance of the current main master component.
     * - called from within the Vuex store in the file  `store.js`.
     */
    enterSlide: (payload: OldAndNewPropsAndSlide, thisArg: ThisArg) => void;
    /**
     * This hook gets executed after the slide number has changed on the
     * component. Use `const slide = this.$get('slide')` to get the current slide
     * object.
     *
     * - `this`: is the Vue instance of the current main master component.
     * - called from the master component mixin in the file `masters.js`.
     */
    afterSlideNoChangeOnComponent: (payload: OldAndNewSlideNos, thisArg: ThisArg) => void;
    /**
     * Called when leaving a step. This hook is only called on the public master
     * component (the one that is visible for the audience), not on further
     * secondary master components (for example the ad hoc slides or the future
     * slide view in the speakers view.)
     *
     * - `this`: is the Vue instance of the current main master component.
     * - called from the Vuex action `setStepNoCurrent` in the file `store.js`.
     */
    leaveStep: (payload: OldAndNewStepNo, thisArg: ThisArg) => any;
    /**
     * Called when entering a step. This hook is only called on the public
     * master component (the one that is visible for the audience), not on
     * further secondary master components (for example the ad hoc slides or the
     * future slide view in the speakers view.)
     *
     * - `this`: is the Vue instance of the current main master component.
     * - called from the Vuex action `setStepNoCurrent` in the file `store.js`.
     */
    enterStep: (payload: OldAndNewStepNo, thisArg: ThisArg) => void;
    /**
     * This hook gets executed after the step number has changed on the
     * component.
     *
     * - `this`: is the Vue instance of the current main master component.
     * - called from the master component mixin in the file `masters.js`.
     */
    afterStepNoChangeOnComponent: (payload: OldAndNewStepNoAndSlideNoChange, thisArg: ThisArg) => void;
    $commit: (commitName: string, payload: any) => void;
}
/**
 * Meta informations can be added to each slide. All properties are possibly
 * undefined.
 */
export declare class SlideMeta {
    /**
     * An unique reference string of a slide (Used for links). Markdown is supported in this property.
     */
    ref?: string;
    /**
     * The title of a slide. Markdown is supported in this property.
     */
    title?: string;
    /**
     * Some text that describes the slide. Markdown is supported in this property.
     */
    description?: string;
    /**
     * The source of the slide, for example a HTTP URL. Markdown is supported in
     * this property.
     */
    source?: string;
}
/**
 * A slide.
 */
export interface Slide {
    /**
     * A deep copy of the raw slide data.
     */
    rawData: any;
    /**
     * The slide number
     */
    no: number;
    /**
     * The additional meta data of a slide.
     */
    meta: SlideMeta;
    /**
     * The corresponding master slide.
     */
    master: Master;
    /**
     * The normalized slide data. This data gets passed through the master slide
     * and then to the props of the Vue components.
     */
    props: StringIndexedData;
    /**
     * Props (properties) to send to the main Vue master component.
     */
    propsMain?: StringIndexedData;
    /**
     * Props (properties) to send to the preview Vue master component.
     */
    propsPreview?: StringIndexedData;
    /**
     * A list of media URIs.
     */
    mediaUris?: Set<string>;
    /**
     * Media URIs that do not have to exist.
     */
    optionalMediaUris?: Set<string>;
    /**
     * How many steps the slide provides.
     */
    stepCount?: number;
    /**
     * The current step number. The first number is 1 not 0.
     */
    stepNo?: number;
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
    /**
     * The level in the hierarchial slide tree.
     */
    level: number;
    /**
     * The scale factor of the current slide. This factor is used to set
     * the font size of parent HTML container. All visual elements of the slide
     * have to react on different font sizes to get a scale factor.
     */
    /**
     * A list of child slides.
     */
    slides: Slide[];
}
/**
 * The meta informations of a presentation file.
 *
 * ```yaml
 * meta:
 *   ref: An unique reference string
 *   uuid: 75bd3ec8-a322-477c-ad7a-5915513f9dd8
 *   title: A title
 *   subtitle: A subtitle
 *   subject: Musik
 *   grade: The grade the presentation belongs to.
 *   curriculum: Relation to the curriculum.
 *   curriculum_url: http://curriculum.com
 * ```
 */
export interface PresentationMeta {
    /**
     * A reference string to identify the presentation (for example:
     * `Wiener-Klassik`)
     */
    ref: string;
    /**
     * A Universally Unique Identifier to identify the presentation.
     */
    uuid?: string;
    /**
     * The title of the presentation. (for example: `Das orchestrale Klangbild bei
     * Beethoven`)
     */
    title: string;
    /**
     * The subtitle of the presentation in the form: `<em
     * class="person">Composer</em>: <em class="piece">Piece</em> (year)`. (for
     * example: `<em class="person">Ludwig van Beethoven</em>: <em
     * class="piece">Sinfonie Nr. 8 F-Dur op. 93</em> (1812)`)
     */
    subtitle?: string;
    /**
     * The school subject, for example `Musik` or `Informatik`.
     */
    subject?: string;
    /**
     * The grade the presentation belongs to. (for example: `11`)
     */
    grade?: number;
    /**
     * Relation to the curriculum. (for example: `Klangkörper im Wandel / Das
     * Klangbild der Klassik`)
     */
    curriculum?: string;
    /**
     * URL of the curriculum web page. (for example:
     * `https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/5/musik`)
     */
    curriculumUrl?: string;
}
/**
 * The type of the YAML file format of a presentation `Praesentation.baldr.yml`
 */
export interface FileFormat {
    meta?: PresentationMeta;
    slides: object;
}
/**
 * A presentation is represented by the YAML file `Praesentation.baldr.yml`.
 * A presentation contains slides and meta data.
 */
export interface Presentation {
    /**
     * The reference of a presentation.
     *
     * ```yml
     * meta:
     *   ref: My-Presentation
     * ```
     */
    ref: string;
    /**
     * The meta informations of a presentation file.
     */
    meta: PresentationMeta;
    /**
     * A flat list of slide objects. All child slides are included in this array.
     */
    slides: Slide[];
    /**
     * Only the top level slide objects are included in this array. Child slides
     * can be accessed under the `slides` property of the Slide instances.
     */
    slidesTree: Slide[];
}
export {};
