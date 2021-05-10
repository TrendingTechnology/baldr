/**
 * Provide a unifed interface for both the Electron and the @bldr/menu menu
 * components.
 *
 * src/vue/apps/lamp/src/MainApp.vue
 *
 * src/vue/apps/lamp/src/components/DropDownMenu.vue
 *
 * @module @bldr/menu-adapter
 */

import type { MenuItemConstructorOptions } from 'electron'

export { getEletronMenuDef, getWebappMenuDef } from './converter'

export type ElectronMenuItem = MenuItemConstructorOptions

export interface UniversalMenuItem {
  /**
   * A short label of the menu entry.
   */
  label: string

  /**
   * A longer description of the menu entry.
   */
  description?: string

  /**
   * Arguments for the action, for example a callback name or a route name or a URL.
   */
  arguments?: any

  /**
   * Keyboard shortcuts to pass through mousetrap
   *   and to pass through the Electron Accelerator.
   */
  keyboardShortcut?: string

  activeOnRoutes?: string[]
}

export interface UniversalLeafMenuItem extends UniversalMenuItem {
  action: 'pushRouter' | 'openExternalUrl' | 'executeCallback' | 'clearCache'
}

export interface UniversalInnerMenuItem extends UniversalMenuItem {
  /**
   * A array of menu entries to build a sub menu from.
   */
  submenu?: RawMenuItem[]
}

export type RawMenuItem = ElectronMenuItem | UniversalLeafMenuItem | UniversalInnerMenuItem

export interface WebappMenuItem {
  label: string
  click: () => void
  keyboardShortcut?: string
}

export interface ActionCollection {
  [actionName: string]: () => void
}
