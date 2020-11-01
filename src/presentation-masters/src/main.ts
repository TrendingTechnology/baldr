
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
