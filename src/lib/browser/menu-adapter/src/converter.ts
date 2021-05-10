import type { Shell, BrowserWindow } from 'electron'
import type { RawMenuItem, UniversalMenuItem, WebappMenuItem, UniversalLeafMenuItem, ElectronMenuItem } from './main'

import { universalMenuDefinition } from './definition'
import { traverseMenu } from './traverse'

export function convertMenuItemWebapp (raw: RawMenuItem, router: any, actions: any) {
  if ('role' in raw) return

  const universal: UniversalMenuItem = raw as UniversalMenuItem
  // label
  if (!universal.label) {
    throw new Error(`Raw menu entry needs a key named label: ${raw}`)
  }
  const label = universal.label
  // click
  if (!('action' in universal)) {
    throw new Error(`Raw menu entry needs a key named action: ${raw}`)
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
    throw new Error(`Unkown action for raw menu entry: ${raw}`)
  }
  const result: WebappMenuItem = {
    label,
    click
  }

  result.click = click
  if (universalLeaf.keyboardShortcut) {
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
    throw new Error(`Raw menu entry needs a key named label: ${raw}`)
  }
  result.label = raw.label
  // click
  if (!('action' in universal)) {
    throw new Error(`Raw menu entry needs a key named action: ${raw}`)
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
      window.webContents.session.clearCache()
      window.webContents.session.clearStorageData()
    }
  } else {
    throw new Error(`Unkown action for raw menu entry: ${raw}`)
  }
  result.click = click
  // accelerator
  if (universalLeaf.keyboardShortcut) {
    result.accelerator = universalLeaf.keyboardShortcut
    // We handle the keyboard shortcuts on the render process side with
    // mousetrap.
    result.registerAccelerator = false
  }
  return result
}

export function getEletronMenuDef(shell: Shell, win: BrowserWindow) {
  traverseMenu(universalMenuDefinition, convertMenuItemElectron, { shell, window })
}
