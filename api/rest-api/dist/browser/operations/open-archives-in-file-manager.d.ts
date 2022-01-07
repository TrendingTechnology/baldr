import { ApiTypes } from '@bldr/type-definitions';
/**
 * Open the current path multiple times.
 *
 * 1. In the main media server directory
 * 2. In a archive directory structure.
 * 3. In a second archive directory structure ... and so on.
 *
 * @param filePath
 * @param createParentDir - Create the directory structure of
 *   the given `currentPath` in a recursive manner.
 */
export default function (filePath: string, createParentDir: boolean): ApiTypes.OpenInFileManagerResult[];
