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

import { Shell, BrowserWindow } from 'electron'
import VueRouter from 'vue-router'

import { traverseMenu } from './traverse'
import {
  ElectronMenuItem,
  WebappMenuItem,
  convertMenuItemElectron,
  convertMenuItemWebapp,
  registerShortcut
} from './menu-item'
import { universalMenuDefinition } from './definition'

export { WebappMenuItem } from './menu-item'

export function getEletronMenuDef (
  shell: Shell,
  window: BrowserWindow
): ElectronMenuItem[] {
  return traverseMenu(universalMenuDefinition, convertMenuItemElectron, {
    shell,
    window
  })
}

export function getWebappMenuDef (
  router: VueRouter,
  actions: any
): WebappMenuItem[] {
  return traverseMenu(universalMenuDefinition, convertMenuItemWebapp, {
    router,
    actions
  })
}

export function registerShortcuts (
  router: VueRouter,
  shortcuts: any,
  actions: any
): void {
  traverseMenu(universalMenuDefinition, registerShortcut, {
    router,
    shortcuts,
    actions
  })
}
