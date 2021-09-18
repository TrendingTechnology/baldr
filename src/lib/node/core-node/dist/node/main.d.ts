/**
 * Low level functions used by the node packages. Some helper
 * functions etc.
 *
 * @module @bldr/core-node
 */
interface GitHead {
    short: string;
    long: string;
    isDirty: boolean;
}
/**
 * Generate a revision string in the form version-gitshort(-dirty)
 */
export declare function gitHead(): GitHead;
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
export declare function fetchFile(url: string, dest: string): Promise<void>;
/**
 * Replace ~ with the home folder path.
 *
 * @see {@link https://stackoverflow.com/a/36221905/10193818}
 */
export declare function untildify(filePath: string): string;
/**
 *
 * @param filePath - A file path to search for a file in one of the parent folder struture.
 * @param fileName - The name of the searched file.
 *
 * @returns The path of the found parent file or undefined if not found.
 */
export declare function findParentFile(filePath: string, fileName: string): string | undefined;
export {};
