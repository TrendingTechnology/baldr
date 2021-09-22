/**
 * Rename a media asset after the `ref` in the meta data file.
 *
 * @param filePath - The media asset file path.
 */
export declare function renameByRef(filePath: string): void;
/**
 * Rename all files which are in the same parent presentation folder
 * as the specified file path.
 *
 * @param filePath - All files which are in the same parent presentation folder
 *   as this file path are renamed.
 */
export declare function renameAllInPresDirByRef(filePath: string): Promise<void>;
