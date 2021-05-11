import type { Shell, BrowserWindow } from 'electron'
import type { RawMenuItem, UniversalMenuItem, WebappMenuItem, UniversalLeafMenuItem, ElectronMenuItem, ActionCollection } from './main'

import { universalMenuDefinition } from './definition'
import { traverseMenu } from './traverse'

interface WebappPayload {
  router: any
  actions: ActionCollection
}

export function convertMenuItemWebapp (raw: RawMenuItem, payload: any): WebappMenuItem | undefined {
  const p = payload as WebappPayload
  const router = p.router
  const actions = p.actions

  if ('role' in raw) return

  const universal: UniversalMenuItem = raw as UniversalMenuItem
  // label
  if (universal.label == null) {
    throw new Error('Raw menu entry needs a key named label')
  }
  const label = universal.label
  // click
  if (!('action' in universal)) {
    throw new Error(`Raw menu entry needs a key named action: ${universal.label}`)
  }

  const universalLeaf: UniversalLeafMenuItem = universal as UniversalLeafMenuItem
  let click
  if (universalLeaf.action === 'openExternalUrl') {

  } else if (universalLeaf.action === 'pushRouter') {
    click = () => {
      router.push({ name: universalLeaf.arguments })
    }
  } else if (universalLeaf.action === 'clearCache') {
    // Only in the electron app. Clear HTTP Cache.
    return
  } else if (universalLeaf.action === 'executeCallback') {
    click = actions[universalLeaf.arguments]
  } else {
    throw new Error(`Unkown action for raw menu entry: ${universalLeaf.label}`)
  }
  if (click == null) return
  const result: WebappMenuItem = {
    label,
    click
  }

  result.click = click
  if (universalLeaf.keyboardShortcut != null) {
    result.keyboardShortcut = universalLeaf.keyboardShortcut
  }
  return result
}

interface ElectronPayload {
  shell: Shell
  window: BrowserWindow
}

export function convertMenuItemElectron (raw: RawMenuItem, payload: any): ElectronMenuItem {
  const p = payload as ElectronPayload
  const shell = p.shell
  const window = p.window

  if ('role' in raw) return raw
  // label
  const result: ElectronMenuItem = {}

  const universal: UniversalMenuItem = raw as UniversalMenuItem

  if (universal.label == null) {
    throw new Error('Raw menu entry needs a key named label')
  }
  result.label = raw.label
  // click
  if (!('action' in universal)) {
    throw new Error(`Raw menu entry needs a key named action: ${universal.label}`)
  }

  const universalLeaf: UniversalLeafMenuItem = universal as UniversalLeafMenuItem

  let click
  if (universalLeaf.action === 'openExternalUrl') {
    click = async () => {
      await shell.openExternal(universalLeaf.arguments)
    }
  } else if (universalLeaf.action === 'pushRouter') {
    click = () => {
      window.webContents.send('navigate', { name: universalLeaf.arguments })
    }
  } else if (universalLeaf.action === 'executeCallback') {
    click = () => {
      window.webContents.send('action', universalLeaf.arguments)
    }
  } else if (universalLeaf.action === 'clearCache') {
    click = () => {
      // Sometimes some images are not updated.
      // We have to delete the http cache.
      // Cache location on Linux: /home/<user>/.config/baldr-lamp/Cache
      window.webContents.session.clearCache().then(() => {}, () => {})
      window.webContents.session.clearStorageData().then(() => {}, () => {})
    }
  } else {
    throw new Error(`Unkown action for raw menu entry: ${universalLeaf.label}`)
  }
  result.click = click
  // accelerator
  if (universalLeaf.keyboardShortcut != null) {
    result.accelerator = universalLeaf.keyboardShortcut
    // We handle the keyboard shortcuts on the render process side with
    // mousetrap.
    result.registerAccelerator = false
  }
  return result
}

export function getEletronMenuDef (shell: Shell, window: BrowserWindow): ElectronMenuItem[] {
  return traverseMenu(universalMenuDefinition, convertMenuItemElectron, { shell, window })
}

export function getWebappMenuDef (router: any, actions: any): WebappMenuItem[] {
  return traverseMenu(universalMenuDefinition, convertMenuItemWebapp, { router, actions })
}
