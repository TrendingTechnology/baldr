import { StringIndexedObject } from '@bldr/type-definitions';
/**
 * Open the current path multiple times.
 *
 * 1. In the main media server directory
 * 2. In a archive directory structure.
 * 3. In a second archive directory structure ... and so on.
 *
 * @param currentPath
 * @param create - Create the directory structure of
 *   the given `currentPath` in a recursive manner.
 */
export default function (currentPath: string, create: boolean): StringIndexedObject;
