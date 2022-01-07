import { Shell, BrowserWindow, MenuItemConstructorOptions } from 'electron'
import VueRouter from 'vue-router'

export type ElectronMenuItem = MenuItemConstructorOptions

/**
 * Sourround `+` with spaces: `Ctrl + f`
 *
 * Special keys:
 * `Ctrl`, `Shift`, `Alt`, `Left`, `Right`, `Up`, `Down`, `Space`
 */
type RawKeyboardShortcutSpecification = string

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
   * Keyboard shortcuts to pass through mousetrap and to pass through the
   * Electron Accelerator.
   */
  keyboardShortcut?: RawKeyboardShortcutSpecification

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

export type RawMenuItem =
  | ElectronMenuItem
  | UniversalLeafMenuItem
  | UniversalInnerMenuItem

export interface WebappMenuItem {
  label: string
  click: () => void
  keyboardShortcut?: string
}

export interface ActionCollection {
  [actionName: string]: () => void
}

interface WebappPayload {
  router: VueRouter
  actions: ActionCollection
}

export function convertMenuItemWebapp (
  raw: RawMenuItem,
  payload: any
): WebappMenuItem | undefined {
  const p = payload as WebappPayload
  const router = p.router
  const actions = p.actions

  if ('role' in raw) {
    return
  }

  const universal: UniversalMenuItem = raw as UniversalMenuItem
  // label
  if (universal.label == null) {
    throw new Error('Raw menu entry needs a key named label')
  }
  const label = universal.label
  // click
  if (!('action' in universal)) {
    throw new Error(
      `Raw menu entry needs a key named action: ${universal.label}`
    )
  }

  const universalLeaf: UniversalLeafMenuItem = universal as UniversalLeafMenuItem
  let click
  if (universalLeaf.action === 'openExternalUrl') {
  } else if (universalLeaf.action === 'pushRouter') {
    click = async () => {
      await router.push({ name: universalLeaf.arguments })
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

export function convertMenuItemElectron (
  raw: RawMenuItem,
  payload: any
): ElectronMenuItem {
  const p = payload as ElectronPayload
  const shell = p.shell
  const window = p.window

  if ('role' in raw) {
    return raw
  }
  // label
  const result: ElectronMenuItem = {}

  const universal: UniversalMenuItem = raw as UniversalMenuItem

  if (universal.label == null) {
    throw new Error('Raw menu entry needs a key named label')
  }
  result.label = raw.label
  // click
  if (!('action' in universal)) {
    throw new Error(
      `Raw menu entry needs a key named action: ${universal.label}`
    )
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
      window.webContents.session.clearCache().then(
        () => {},
        () => {}
      )
      window.webContents.session.clearStorageData().then(
        () => {},
        () => {}
      )
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

/**
 * Normalize the keyboard shortcuts.
 *
 * @param keys - A raw keyboard shortcut specification.
 * @param forClient - For which client the shortcuts have to
 *   normalized. Possible values are “mousetrap” or “electron” (Accelerator.)
 */
export function normalizeKeyboardShortcuts (
  keys: RawKeyboardShortcutSpecification,
  forClient: 'mousetrap' | 'electron' = 'mousetrap'
): string {
  if (forClient === 'mousetrap') {
    // See https://craig.is/killing/mice
    keys = keys.replace('Plus', 'plus')
    keys = keys.replace('Tab', 'tab')
    keys = keys.replace('Return', 'enter')
    keys = keys.replace('Ctrl', 'ctrl')
    keys = keys.replace('Shift', 'shift')
    keys = keys.replace('Alt', 'alt')
    keys = keys.replace('Left', 'left')
    keys = keys.replace('Right', 'right')
    keys = keys.replace('Up', 'up')
    keys = keys.replace('Down', 'down')
    keys = keys.replace('Space', 'space')
  } else if (forClient === 'electron') {
    // https://www.electronjs.org/docs/api/accelerator
    keys = keys.replace('Ctrl', 'CommandOrControl')
  }
  return keys.replace(/\s+\+\s+/g, '+')
}

interface RegisterShortcutsPayload {
  router: VueRouter
  shortcuts: any
  actions: ActionCollection
}

export function registerShortcut (
  raw: RawMenuItem,
  payload: RegisterShortcutsPayload
): void {
  const p = payload
  const router = p.router
  const actions = p.actions
  const shortcuts = p.shortcuts

  let action
  if (!('keyboardShortcut' in raw) && !('action' in raw)) {
    return
  }
  const universal: UniversalLeafMenuItem = raw as UniversalLeafMenuItem
  if (universal.keyboardShortcut == null) {
    return
  }
  if (universal.action === 'executeCallback') {
    action = actions[raw.arguments]
  } else if (universal.action === 'pushRouter') {
    action = async () => {
      await router.push({ name: raw.arguments })
    }
  } else if (universal.action === 'openExternalUrl') {
    action = () => {
      window.open(raw.arguments, '_blank')
    }
  } else if (universal.action === 'clearCache') {
    // Only in the electron app. Clear HTTP Cache.
    return
  } else {
    throw new Error(`Unkown action for raw menu entry: ${raw.label}`)
  }
  shortcuts.add(
    normalizeKeyboardShortcuts(universal.keyboardShortcut),
    action,
    raw.label,
    raw.activeOnRoutes
  )
}
