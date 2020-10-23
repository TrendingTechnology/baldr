/**
 * Low level classes and functions used by the node packages. Some helper
 * functions etc.
 *
 * @module @bldr/core-node
 */
/**
 * Wrapper around `util.format()` and `console.log()`
 */
export declare function log(format: string): void;
/**
 * Generate a revision string in the form version-gitshort(-dirty)
 */
export declare function gitHead(): object;
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
declare const _default: {
    checkExecutables: typeof checkExecutables;
    getPdfPageCount: typeof getPdfPageCount;
    gitHead: typeof gitHead;
    log: typeof log;
};
export default _default;
