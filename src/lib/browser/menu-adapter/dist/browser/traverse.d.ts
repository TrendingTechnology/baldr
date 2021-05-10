import type { RawMenuItem } from './main';
/**
 * @param keys - A raw keyboard shortcut specification.
 * @param forClient - For which client the shortcuts have to
 *   normalized. Possible values are “mousetrap” or “electron” (Accelerator.)
 */
export declare function normalizeKeyboardShortcuts(keys: string, forClient?: 'mousetrap' | 'electron'): string;
/**
 * @param input - An array of raw menu items.
 * @param func - A function which is called with the argument
 *   `rawMenuItem`.
 *
 * @returns A recursive array of processed menu items.
 */
export declare function traverseMenu(input: RawMenuItem[], func: (input: RawMenuItem, payload?: any) => any, payload?: any): any[];
