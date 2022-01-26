/**
 * Provide a unifed interface for both the Electron and the @bldr/menu menu
 * components.
 *
 * src/vue/apps/presentation/src/MainApp.vue
 *
 * src/vue/apps/presentation/src/components/DropDownMenu.vue
 *
 * @module @bldr/menu-adapter
 */

import { Shell, BrowserWindow } from 'electron'
import VueRouter from 'vue-router'

// import { ShortcutManager } from '@bldr/shortcuts'

import { RawMenuItem } from './menu-item'

import { traverseMenu } from './traverse'
import {
  ElectronMenuItem,
  WebappMenuItem,
  convertMenuForElectron,
  convertMenuForWebapp,
  registerShortcut
} from './menu-item'

export { traverseMenu } from './traverse'
export {
  ElectronMenuItem,
  RawMenuItem,
  WebappMenuItem,
  convertMenuForElectron,
  convertMenuForWebapp
} from './menu-item'

type Actions = {
  [actionName: string]: () => void
}

export function getEletronMenuDef (
  menu: RawMenuItem[],
  shell: Shell,
  window: BrowserWindow
): ElectronMenuItem[] {
  return traverseMenu(menu, convertMenuForElectron, {
    shell,
    window
  })
}

export function getWebappMenuDef (
  menu: RawMenuItem[],
  router: VueRouter,
  actions: Actions
): WebappMenuItem[] {
  return traverseMenu(menu, convertMenuForWebapp, {
    router,
    actions
  })
}

export function registerShortcuts (
  menu: RawMenuItem[],
  router: VueRouter,
  shortcuts: any,
  actions: Actions
): void {
  traverseMenu(menu, registerShortcut, {
    router,
    shortcuts,
    actions
  })
}
