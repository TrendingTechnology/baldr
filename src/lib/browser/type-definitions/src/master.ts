export interface StringObject { [key: string]: any }

/**
 * The
 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call thisArg}
 * a function is called with.
 */
type ThisArg = object

export interface PropsAndMaster {
  props: StringObject
  master: Master
}

export interface PropsAndSlide {
  props: StringObject
  propsMain: StringObject
  slide: object
}

export interface PropsSlideAndMaster extends PropsAndSlide {
  propsPreview: StringObject
  master: object
}

export interface PropsBundle {
  props: StringObject
  propsMain: StringObject
  propsPreview: StringObject
}

export interface OldAndNewPropsAndSlide {
  oldSlide: object
  oldProps: StringObject
  newSlide: object
  newProps: StringObject
}

export interface OldAndNewStepNo {
  oldStepNo: number
  newStepNo: number
}

export interface OldAndNewStepNoAndSlideNoChange extends OldAndNewStepNo {
  slideNoChange: boolean
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
  normalizeProps?: (props: any) => StringObject

  /**
   * Retrieve the media URIs which have to be resolved.
   *
   * Call the master funtion `resolveMediaUris` and collect the media URIs.
   * (like [id:beethoven, id:mozart]). Extract media URIs from
   * the text props.
   *
   * Called during the parsing the YAML file (`Praesentation.baldr.yml`).
   *
   * ```js
   * export const default = {
   *   hooks: {
   *     // An array of media URIs to resolve (like [id:beethoven, id:mozart.mp3])
   *     resolveMediaUris (props) {
   *       return props.src
   *     }
   *   }
   * }
   * ```
   */
  resolveMediaUris?: (props: StringObject) => string | string[]

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
   *     // An array of media URIs to resolve (like [id:beethoven, id:mozart.mp3])
   *     resolveOptionalMediaUris (props) {
   *       return props.src
   *     }
   *   }
   * }
   * ```
   */
  resolveOptionalMediaUris?: (props: StringObject) => string | string[]

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
   *       master.$commit('addBody', { id: formatId(props.language, props.title), body: body })
   *     }
   *   }
   * }
   * ```
   */
  afterLoading?: () => Promise<void>

  /**
   * This hook gets executed after the media resolution. Wait for this hook to
   * finish. Go not in the background. Called during the parsing the YAML file
   * (`Praesentation.baldr.yml`). Blocks.
   *
   * - `this`: is the main Vue instance.
   *
   * ```js
   * export const default = {
   *   hooks {
   *     async afterMediaResolution ({ props, master }) {
   *     }
   *   }
   * }
   * ```
   */
  afterMediaResolution?: (payload: PropsAndMaster) => Promise<void>

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
  collectPropsMain?: (payload: PropsAndSlide) => StringObject

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
  collectPropsPreview?: (payload: PropsAndSlide) => StringObject

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
  calculateStepCount?: (payload: PropsSlideAndMaster) => number

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
  titleFromProps?: (payload: PropsBundle) => string

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
  plainTextFromProps?: (props: StringObject) => string

  /**
   * Called when leaving a slide. This hook is triggered by the Vue lifecycle
   * hook `beforeDestroy`.
   *
   * ```js
   * export const default = {
   *   hooks: {
   *     // Called when leaving a slide.
   *     leaveSlide ({ oldSlide, oldProps, newSlide, newProps }) {
   *     }
   *   }
   * }
   *
   * ```
   */
  leaveSlide?: (payload: OldAndNewPropsAndSlide) => void

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
   *     // Called when entering a slide.
   *     enterSlide ({ oldSlide, oldProps, newSlide, newProps }) {
   *     }
   *   }
   * }
   * ```
   */
  enterSlide?: (payload: OldAndNewPropsAndSlide) => void

  /**
   * This hook gets executed after the slide number has changed on the
   * component. Use `const slide = this.$get('slide')` to get the current
   * slide object.
   *
   * - `this`: is the Vue instance of the current main master component.
   * - called from the master component mixin in the file `masters.js`.
   */
  afterSlideNoChangeOnComponent?: (payload: OldAndNewPropsAndSlide) => void

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
   *     // Called when leaving a step.
   *     leaveStep ({ oldStepNo, newStepNo }) {
   *     }
   *   }
   * }
   * ```
   */
  leaveStep?: (payload: OldAndNewStepNo) => void

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
   *     // Called when entering a step.
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
  enterStep?: (payload: OldAndNewStepNo) => void

  /**
   * This hook gets executed after the step number has changed on the
   * component.
   *
   * - `this`: is the Vue instance of the current main master component.
   * - called from the master component mixin in the file `masters.js`.
   */
  afterStepNoChangeOnComponent?: (payload: OldAndNewStepNoAndSlideNoChange) => void

  /**
   * To allows access of the functions using the bracket notation with strings.
   */
  [key: string]: Function | any
}

/**
 * An extended version of the Vue `props` defintion.
 * Additional `props` keys (in comparison to the Vue props)
 *
 * ```js
 *  const props = {
 *    src: {
 *      default: 'id:Fuer-Elise'
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
interface MasterProp {
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
 *   name: 'comment-quote',
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
}

export interface StyleConfig {
  centerVertically?: boolean
  darkMode?: boolean
  contentTheme?: string
  uiTheme?: string
}

export interface PropsDefintion {
  [key: string]: MasterProp
}

interface Store {
  state: object
  getters?: object
  actions?: object
  mutations?: object
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
  name: string

  /**
   * The human readable title of the master slide.
   */
  title: string

  icon: MasterIconSpec

  styleConfig: StyleConfig

  /**
   * The properties of the master slide.
   */
  propsDef: PropsDefintion

  /**
   * A collection of the master hooks (exported master methods.)
   */
  hooks?: MasterHooks

  /**
   * A vuex object containing `state`, `getters`, `actions`, `mutations`
   * properties which buildes a submodule vuex store for each master.
   */
  store?: Store
}

interface MasterIcon {}

/**
 * Each master slide has an instance of this class.
 */
export interface Master {
  /**
   * A instance of `MasterIcon` which holds information about the master icon.
   */
  icon: MasterIcon

  /**
   * Some markdown formated string to document this master slide.
   */
  documentation?: string

  /**
   * The short name of the master slide. Should be a shorter string without
   * spaces in the camelCase format.
   */
  name: string

  /**
   * The human readable title of the master slide.
   */
  title: string

  /**
   * The name of the props which are supporting inline media (for example
   * `markup`)
   */
  propNamesInlineMedia: string[]

  /**
   * Convert in the props certain strings containing markup to HTML.
   */
  convertMarkdownToHtml: (props: StringObject) => StringObject

  /**
   * Raise an error if there is an unkown prop - a not in the `props` section
   * defined prop.
   */
  detectUnkownProps: (props: StringObject) => void

  /**
   * Validate all media file URIs in the props of a certain slide.
   */
  validateUris: (props: StringObject) => StringObject

  /**
   * Normalize the properties so the result fits to props defintion of the
   * master slide.. Called during the parsing the YAML file
   * (`Praesentation.baldr.yml`)
   */
  normalizeProps: (propsRaw: any) => StringObject

  /**
   * Retrieve the media URIs which have to be resolved.
   *
   * Call the master funtion `resolveMediaUris` and collect the media URIs.
   * (like [id:beethoven, id:mozart]). Extract media URIs from
   * the text props.
   */
  resolveMediaUris: (props: StringObject) => Set<string> | undefined

  /**
   * Check if the handed over media URIs can be resolved. Throw no errors, if
   * the media assets are not present. This hook is used in the YouTube master
   * slide. This master slide uses the online version, if no offline video could
   * be resolved. Called during the parsing the YAML file
   * (`Praesentation.baldr.yml`).
   */
  resolveOptionalMediaUris: (props: StringObject) => Set<string> | undefined

  /**
   * This hook after is called after loading. To load resources in the
   * background. Goes in the background. Called during the parsing the YAML file
   * (`Praesentation.baldr.yml`).
   *
   * - `this`: is the main Vue instance.
   *
   * @param props - The properties of the slide.
   */
  afterLoading: (props: StringObject, thisArg: ThisArg) => void

  /**
   * This hook gets executed after the media resolution. Wait for this hook to
   * finish. Go not in the background. Called during the parsing the YAML file
   * (`Praesentation.baldr.yml`). Blocks.
   *
   * - `this`: is the main Vue instance.
   *
   * @param props - The properties of the slide.
   */
  afterMediaResolution: (props: StringObject, thisArg: ThisArg) => Promise<void>

  /**
   * Collect the props (properties) for the main Vue component.
   *
   * @param props - The props of the master slide.
   *
   * @returns The props for the main component as a object.
   */
  collectPropsMain: (props: StringObject, thisArg: ThisArg) => StringObject

  /**
   * Collect the props (properties) for the preview Vue component. Called
   * during the parsing the YAML file (`Praesentation.baldr.yml`).
   *
   * - `this`: is the main Vue instance.
   *
   * @returns The props for the preview component as a object.
   */
  collectPropsPreview: (payload: PropsAndSlide, thisArg: ThisArg) => StringObject

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
  calculateStepCount: (payload: PropsSlideAndMaster, thisArg: ThisArg) => number

  /**
   * Determine a title from the properties.
   */
  titleFromProps: (payload: PropsBundle) => string

  /**
   * Extract a plain text from the props (properties) of a slide.
   */
  plainTextFromProps: (props: any) => string

  /**
   * Called when leaving a slide. This hook is triggered by the Vue lifecycle
   * hook `beforeDestroy`.
   */
  leaveSlide: (payload: OldAndNewPropsAndSlide, thisArg: ThisArg) => void

  /**
   * Called when entering a slide. This hook is only called on the public master
   * component (the one that is visible for the audience), not on further
   * secondary master components (for example the ad hoc slides or the future
   * slide view in the speakers view.)
   *
   * - `this`: is the Vue instance of the current main master component.
   * - called from within the Vuex store in the file  `store.js`.
   */
  enterSlide: (payload: OldAndNewPropsAndSlide, thisArg: ThisArg) => void

  /**
   * This hook gets executed after the slide number has changed on the
   * component. Use `const slide = this.$get('slide')` to get the current slide
   * object.
   *
   * - `this`: is the Vue instance of the current main master component.
   * - called from the master component mixin in the file `masters.js`.
   */
  afterSlideNoChangeOnComponent: (payload: OldAndNewPropsAndSlide, thisArg: ThisArg) => void

  /**
   * Called when leaving a step. This hook is only called on the public master
   * component (the one that is visible for the audience), not on further
   * secondary master components (for example the ad hoc slides or the future
   * slide view in the speakers view.)
   *
   * - `this`: is the Vue instance of the current main master component.
   * - called from the Vuex action `setStepNoCurrent` in the file `store.js`.
   */
  leaveStep: (payload: OldAndNewStepNo, thisArg: ThisArg) => any

  /**
   * Called when entering a step. This hook is only called on the public
   * master component (the one that is visible for the audience), not on
   * further secondary master components (for example the ad hoc slides or the
   * future slide view in the speakers view.)
   *
   * - `this`: is the Vue instance of the current main master component.
   * - called from the Vuex action `setStepNoCurrent` in the file `store.js`.
   */
  enterStep: (payload: OldAndNewStepNo, thisArg: ThisArg) => void

  /**
   * This hook gets executed after the step number has changed on the
   * component.
   *
   * - `this`: is the Vue instance of the current main master component.
   * - called from the master component mixin in the file `masters.js`.
   */
  afterStepNoChangeOnComponent: (payload: OldAndNewStepNoAndSlideNoChange, thisArg: ThisArg) => void
}
