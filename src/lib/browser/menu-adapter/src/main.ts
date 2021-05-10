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

import type { Shell, BrowserWindow, MenuItemConstructorOptions } from 'electron'

type ElectronMenuItem = MenuItemConstructorOptions

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

/**
 * @param keys - A raw keyboard shortcut specification.
 * @param forClient - For which client the shortcuts have to
 *   normalized. Possible values are “mousetrap” or “electron” (Accelerator.)
 */
export function normalizeKeyboardShortcuts (keys: string, forClient: 'mousetrap' | 'electron' = 'mousetrap'): string {
  if (forClient === 'mousetrap') {
    // See https://craig.is/killing/mice
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

/**
 * @param input - An array of raw menu items.
 * @param output - An array with processed menu items.
 * @param func - A function which is called with the argument
 *   `rawMenuItem`.
 *
 * @returns A recursive array of processed menu items.
 */
function traverseMenuItemList (input: RawMenuItem[], output: any[], func: (input: RawMenuItem) => any): any[] {
  for (const rawMenuItem of input) {
    let result
    if ('submenu' in rawMenuItem && rawMenuItem.submenu != null) {
      result = {
        label: rawMenuItem.label,
        submenu: traverseMenuItemList(rawMenuItem.submenu, [], func)
      }
    } else {
      result = func(rawMenuItem)
    }
    output.push(result)
  }
  return output
}

interface WebappMenuItem {
  label: string
  click: () => {}
  keyboardShortcut?: string
}

function convertMenuItemWebapp (raw: RawMenuItem, router: any, actions: any) {
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

/**
 * @param {module:@bldr/lamp/menu.RawMenuItem} raw
 */
 function convertMenuItemElectron (raw: RawMenuItem, shell: Shell, win: BrowserWindow): ElectronMenuItem {
  if ('role' in raw) return raw
  // label
  const result: ElectronMenuItem = {}

  const universal: UniversalMenuItem = raw as UniversalMenuItem

  if (universal.label == null ) {
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
      win.webContents.send('navigate', { name: universalLeaf.arguments })
    }
  } else if (universalLeaf.action === 'executeCallback') {
    click = () => {
      win.webContents.send('action', universalLeaf.arguments)
    }
  } else if (universalLeaf.action === 'clearCache') {
    click = () => {
      // Sometimes some images are not updated.
      // We have to delete the http cache.
      // Cache location on Linux: /home/<user>/.config/baldr-lamp/Cache
      win.webContents.session.clearCache()
      win.webContents.session.clearStorageData()
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

function registerShortcuts (raw: RawMenuItem, router: any, shortcuts: any)  {
  let action
  if (!raw.keyboardShortcut) return
  if (raw.action === 'executeCallback') {
    action = actions[raw.arguments]
  } else if (raw.action === 'pushRouter') {
    action = () => {
      router.push({ name: raw.arguments })
    }
  } else if (raw.action === 'openExternalUrl') {
    action = () => {
      window.open(raw.arguments, '_blank')
    }
  } else if (raw.action === 'clearCache') {
    // Only in the electron app. Clear HTTP Cache.
    return
  } else {
    throw new Error(`Unkown action for raw menu entry: ${raw.label}`)
  }
  shortcuts.add(normalizeKeyboardShortcuts(raw.keyboardShortcut), action, raw.label, raw.activeOnRoutes)
}

/**
 * @param input - An array of raw menu items.
 * @param func - A function which is called with the argument
 *   `rawMenuItem`.
 *
 * @returns A recursive array of processed menu items.
 */
export function traverseMenu (input: RawMenuItem[], func: (input: RawMenuItem) => any): any[] {
  const newMenu: any[] = []
  traverseMenuItemList(input, newMenu, func)
  return newMenu
}
