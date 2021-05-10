import type { RawMenuItem, UniversalInnerMenuItem, UniversalLeafMenuItem, ActionCollection } from './main'

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
function traverseMenuItemList (input: RawMenuItem[], output: any[], func: (input: RawMenuItem, payload?: any) => any, payload?: any): any[] {
  for (const rawMenuItem of input) {
    let result
    if ('submenu' in rawMenuItem && rawMenuItem.submenu != null) {
      const universalInner: UniversalInnerMenuItem[] = rawMenuItem.submenu as UniversalInnerMenuItem[]
      result = {
        label: rawMenuItem.label,
        submenu: traverseMenuItemList(universalInner, [], func, payload)
      }
    } else {
      result = func(rawMenuItem, payload)
    }
    if (result != null) {
      output.push(result)
    }
  }
  return output
}

function registerShortcuts (raw: RawMenuItem, router: any, shortcuts: any, actions: ActionCollection) {
  let action
  if (!('keyboardShortcut' in raw) && !('action' in raw)) return
  const universal: UniversalLeafMenuItem = raw as UniversalLeafMenuItem
  if (universal.keyboardShortcut == null) return
  if (universal.action === 'executeCallback') {
    action = actions[raw.arguments]
  } else if (universal.action === 'pushRouter') {
    action = () => {
      router.push({ name: raw.arguments })
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
  shortcuts.add(normalizeKeyboardShortcuts(universal.keyboardShortcut), action, raw.label, raw.activeOnRoutes)
}

/**
 * @param input - An array of raw menu items.
 * @param func - A function which is called with the argument
 *   `rawMenuItem`.
 *
 * @returns A recursive array of processed menu items.
 */
export function traverseMenu (input: RawMenuItem[], func: (input: RawMenuItem, payload?: any) => any, payload?: any): any[] {
  const newMenu: any[] = []
  traverseMenuItemList(input, newMenu, func, payload)
  return newMenu
}
