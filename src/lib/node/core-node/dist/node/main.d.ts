/**
 * Low level functions used by the node packages. Some helper
 * functions etc.
 *
 * @module @bldr/core-node
 */
/**
 * Wrapper around `util.format()` and `console.log()`
 */
export declare function log(format: string, ...args: any): void;
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
 * Read the content of a text file in the `utf-8` format.
 *
 * A wrapper around `fs.readFileSync()`
 *
 * @param filePath - A path of a text file.
 *
 * @returns The content of the file in the `utf-8` format.
 */
export declare function readFile(filePath: string): string;
/**
 * Write some text content into a file.
 *
 * @param filePath - A path of a text file.
 * @param content - Some text to write to a file.
 */
export declare function writeFile(filePath: string, content: string): void;
export {};
