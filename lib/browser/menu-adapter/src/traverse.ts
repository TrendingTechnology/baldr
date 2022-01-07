import { RawMenuItem, UniversalInnerMenuItem } from './menu-item'

/**
 * @param input - An array of raw menu items.
 * @param output - An array with processed menu items.
 * @param func - A function which is called with the argument
 *   `rawMenuItem`.
 *
 * @returns A recursive array of processed menu items.
 */
function traverseMenuItemList (
  input: RawMenuItem[],
  output: any[],
  func: (input: RawMenuItem, payload?: any) => any,
  payload?: any
): any[] {
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

/**
 * @param input - An array of raw menu items.
 * @param func - A function which is called with the argument
 *   `rawMenuItem`.
 *
 * @returns A recursive array of processed menu items.
 */
export function traverseMenu (
  input: RawMenuItem[],
  func: (input: RawMenuItem, payload?: any) => any,
  payload?: any
): any[] {
  const newMenu: any[] = []
  traverseMenuItemList(input, newMenu, func, payload)
  return newMenu
}
