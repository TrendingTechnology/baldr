import VueRouter from 'vue-router'
import { Shell, BrowserWindow } from 'electron'

import * as menu from '@bldr/menu-adapter'
import { ShortcutManager } from '@bldr/shortcuts'

import menuDef from './menu-definition'
import { Actions } from './actions'

export function getEletronMenuDef (
  shell: Shell,
  window: BrowserWindow
): menu.ElectronMenuItem[] {
  return menu.getEletronMenuDef(menuDef, shell, window)
}

export function getWebappMenuDef (
  router: VueRouter,
  actions: Actions
): menu.WebappMenuItem[] {
  return menu.getWebappMenuDef(menuDef, router, actions)
}

export function registerShortcuts (
  router: VueRouter,
  shortcuts: typeof ShortcutManager,
  actions: Actions
): void {
  menu.registerShortcuts(menuDef, router, shortcuts, actions)
}
