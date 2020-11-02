
type StringObject = { [key: string]: any }

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
  collectPropsMain?: ({ props, propsMain, slide }: StringObject) => StringObject

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
  collectPropsPreview?: ({ props, propsMain, slide }: StringObject) => StringObject

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
  calculateStepCount?: ({ props, propsMain, propsPreview, slide, master }: StringObject) => number
}

/**
 * Additional `props` keys (in comparison to the Vue props)
 */
interface MasterProp {
  /**
   * Text to describe the property.
   */
  description?: string

  /**
   * The specified value can contain markup. The value can be written in
   * Markdown and or in HTML. is converted into HTML. The key `type` has
   * to be `String`.
   */
  markup?: boolean
}

interface MasterSpec {
  /**
   * The human readable title of the master slide.
   */
  title: string

  /**
   * The properties of the master slide.
   */
  props: { [key: string]: MasterProp }

  /**
   * A collection of the master hooks (exported master methods.)
   */
  hooks?: MasterHooks
}
