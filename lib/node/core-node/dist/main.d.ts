/**
 * Low level functions used by the node packages. Some helper
 * functions etc.
 *
 * @module @bldr/core-node
 */
/**
 * ```js
 * const __filename = getFilename(import.meta)
 * ```
 */
export declare function getFilename(meta: ImportMeta): string;
/**
 * ```js
 * const new URL('.', import.meta.url).pathname = getDirname(import.meta)
 * ```
 */
export declare function getDirname(meta: ImportMeta): string;
/**
 * ```js
 * if (require.main === module) {
 *   // Do something special.
 * }
 * ```
 *
 * https://github.com/tschaub/es-main/blob/main/main.js
 */
export declare function isModuleMain(meta: ImportMeta): boolean;
interface GitHead {
    short: string;
    long: string;
    isDirty: boolean;
}
/**
 * Generate a revision string in the form version-gitshort(-dirty)
 */
export declare function getGitHead(): GitHead;
/**
 * Check if some executables are installed. Throws an error if not.
 *
 * @param executables - An array of executables names or a
 *   a single executable as a string.
 */
export declare function checkExecutables(executables: string | string[]): void;
/**
 * Get the page count of an PDF file. You have to install the command
 * line utility `pdfinfo` from the Poppler PDF suite.
 *
 * @see {@link https://poppler.freedesktop.org}
 *
 * @param filePath - The path on an PDF file.
 */
export declare function getPdfPageCount(filePath: string): number;
/**
 * Download a URL to a destination.
 *
 * @param url - The URL.
 * @param dest - The destination. Missing parent directories are
 *   automatically created.
 */
export declare function fetchFile(httpUrl: string, dest: string): Promise<void>;
/**
 * Replace ~ with the home folder path.
 *
 * @see {@link https://stackoverflow.com/a/36221905/10193818}
 */
export declare function untildify(filePath: string): string;
/**
 * Find a specific file by file name in a parent folder structure
 *
 * @param filePath - A file path to search for a file in one of the parent
 *   folder struture.
 * @param fileName - The name of the searched file.
 *
 * @returns The path of the found parent file or undefined if not found.
 */
export declare function findParentFile(filePath: string, fileName: string): string | undefined;
/**
 * Extract the base name without the extension from a file path.
 *
 * @param filePath A file path.
 *
 * @returns The base name without the extension.
 */
export declare function getBasename(filePath: string): string;
/**
 * Create a path like `/tmp/baldr-`. The path does not exist yet. It has
 * to be created.
 *
 * @returns A file path in the temporary OS directory containing `baldr`.
 */
export declare function getTmpDirPath(): string;
/**
 * Create a temporary directory.
 *
 * @returns The path of the created temporary directory.
 */
export declare function createTmpDir(): string;
/**
 * Copy a file to the temporary directory of the operation system.
 *
 * @param pathSegments - Path segments for `path.join()`.
 *
 * @returns The destination path in the temporary directory of the OS.
 */
export declare function copyToTmp(...pathSegments: string[]): string;
export {};
