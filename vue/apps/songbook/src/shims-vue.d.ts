import Vue from 'vue'

declare class DynamicSelect {
  /**
   * Set the focus on the Dynamic Select input text field.
   */
  focus (): void
}

interface ModalDialog {
  hide(name: string): void
  toggle(name: string): void
  show(name: string): void
  isOpen(): boolean
}

interface ShortcutSpecification {
  /**
   * Mousetrap key specification, see the
   * {@link https://craig.is/killing/mice documentation}.
   */
  keys: string

  /**
   * A callback function.
   */
  callback: Function

  /**
   * Some text to describe the shortcut.
   */
  description

  /**
   * A list of route names. Activate this shortcut only on this routes.
   */
  routeNames?: string[]
}

/**
 * This class is mounted under `this.$shortcuts`
 */
interface ShortcutsManager {
  /**
   * Add a shortcut.
   *
   * @param keys - Mousetrap key specification, see the
   *   {@link https://craig.is/killing/mice documentation}.
   * @param callback - A callback function.
   * @param description - Some text to describe the shortcut.
   * @param routeNames - A list of route names. Activate this
   *   shortcut only on this routes.
   */
  add(
    keys: string,
    callback: Function,
    description: string,
    routeNames?: string[]
  ): void

  /**
   * Add multiple shortcuts
   */
  addMultiple(shortcutSpecs: ShortcutSpecification[]): void

  /**
   * Remove a shortcut.
   *
   * @param keys - Mousetrap key specification, see the
   *   {@link https://craig.is/killing/mice documentation}.
   */
  remove(keys: string): void

  /**
   * Remove multiple shortcuts at once.
   *
   * @param keysList - An array of Mousetrap key specification.
   */
  removeMultiple(keysList: string[]): void

  /**
   *
   * @param {Object} route
   */
  addRoute(route): void

  /**
   * @param {Object} route
   */
  fromRoute(route): void

  /**
   * @param {object} router - The router object of the Vue router (this.$router)
   */
  fromRoutes(): void

  pause(): void

  unpause(): void
}

declare module 'vue/types/vue' {
  interface Vue {
    $modal: ModalDialog
    /**
     * Global attribute for DynamicSelect
     */
    $dynamicSelect: DynamicSelect
    $fullscreen: () => void

    $shortcuts: ShortcutsManager
  }
}

declare module '*.vue' {
  export default Vue
}
