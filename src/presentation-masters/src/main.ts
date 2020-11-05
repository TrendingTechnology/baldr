
type StringObject = { [key: string]: any }

interface PropsAndSlide {
  props: StringObject
  propsMain: StringObject
  slide: object
}

interface PropsSlideAndMaster extends PropsAndSlide {
  propsPreview: StringObject
  master: object
}

interface PropsBundle {
  props: StringObject
  propsMain: StringObject
  propsPreview: StringObject
}

interface OldAndNewPropsAndSlide {
  oldSlide: object
  oldProps: StringObject
  newSlide: object
  newProps: StringObject
}

interface OldAndNewStepNo {
  oldStepNo: number
  newStepNo: number
}

interface OldAndNewStepNoAndSlideNoChange extends OldAndNewStepNo {
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
   * Check if the handed over media URIs can be resolved. Throw no
   * errors, if the media assets are not present. This hook is used in
   * the YouTube master slide. This master slide uses the online
   * version, if no offline video could be resolved.
   *
   * Called during the parsing the YAML file
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
   * Goes in the background.
   *
   * Called during the parsing the YAML file (`Praesentation.baldr.yml`)
   *
   * - `this`: is the main Vue instance.
   * - `return`: void.
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
   * Called during the parsing the YAML file (`Praesentation.baldr.yml`).
   *
   * Blocks
   *
   * - `this`: is the main Vue instance.
   * - `return`: void.
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
  afterMediaResolution?: () => Promise<void>

  /**
   *
   * ### 6. `collectPropsMain(props)`
   *
   * - `this`: is the main Vue instance.
   * - `return`: an object.
   *
   * ```js
   * export const default = {
   * }
   * ```
   */
  collectPropsMain?: (payload: PropsAndSlide) => StringObject

  /**
   * Called during the parsing the YAML file (`Praesentation.baldr.yml`).
   *
   * - `this`: is the main Vue instance.
   * - `return`: an object.
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
   * Called during the parsing the YAML file (`Praesentation.baldr.yml`).
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
   * Getter on the slide object.
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
   * Getter on the slide object.
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
   * Slide change.
   *
   * This hook is only called on the public master component (the one that is
   * visible for the audience), not on further secondary master components (for
   * example the ad hoc slides or the future slide view in the speakers view.)
   *
   * - `this`: is the Vue instance of the current main master component.
   * - called from within the Vuex store in the file  `store.js`.
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
   * Slide change
   *
   * This hook is only called on the public master component (the one that is
   * visible for the audience), not on further secondary master components (for
   * example the ad hoc slides or the future slide view in the speakers view.)
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
   * Slide change
   *
   * - `this`: is the Vue instance of the current main master component.
   * - called from the master component mixin in the file `masters.js`.
   */
  afterSlideNoChangeOnComponent?: (payload: OldAndNewPropsAndSlide) => void

  /**
   * Step change
   *
   * This hook is only called on the public master component (the one that is
   * visible for the audience), not on further secondary master components (for
   * example the ad hoc slides or the future slide view in the speakers view.)
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
  leaveStep?: (payload: OldAndNewPropsAndSlide) => void

  /**
   * Step change
   * ### 2. ``
   *
   * This hook is only called on the public master component (the one that is
   * visible for the audience), not on further secondary master components (for
   * example the ad hoc slides or the future slide view in the speakers view.)
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
  enterStep?: (payload: OldAndNewPropsAndSlide) => void

  /**
   * Step change
   *
   * - `this`: is the Vue instance of the current main master component.
   * - called from the master component mixin in the file `masters.js`.
   * - `return`: void
   */
  afterStepNoChangeOnComponent?: (payload: OldAndNewStepNoAndSlideNoChange) => void

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
  default?: 'id:Fuer-Elise'

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

interface MasterIconSpec {
  name: string
  color: string
}

interface MasterSpec {
  /**
   * The human readable title of the master slide.
   */
  title: string

  icon: MasterIconSpec

  /**
   * The properties of the master slide.
   */
  props: { [key: string]: MasterProp }

  /**
   * A collection of the master hooks (exported master methods.)
   */
  hooks?: MasterHooks
}
