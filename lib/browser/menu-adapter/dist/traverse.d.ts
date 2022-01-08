import { RawMenuItem } from './menu-item';
/**
 * @param input - An array of raw menu items.
 * @param func - A function which is called with the argument
 *   `rawMenuItem`.
 *
 * @returns A recursive array of processed menu items.
 */
export declare function traverseMenu(input: RawMenuItem[], func: (input: RawMenuItem, payload?: any) => any, payload?: any): any[];
