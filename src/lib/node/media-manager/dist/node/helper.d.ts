/**
 * @module @bldr/media-manager/helper
 */
/**
 * Convert some unicode strings into the ASCII format.
 */
export declare function asciify(input: string): string;
/**
 * This function can be used to generate IDs from different file names.
 *
 * It performes some addictional replacements which can not be done in `asciify`
 * (`asciffy` is sometimes applied to paths.)
 */
export declare function referencify(input: string): string;
/**
 * This function can be used to generate a title from an ID string.
 */
export declare function deasciify(input: string): string;
/**
 * Replace ~ with the home folder path.
 *
 * @see {@link https://stackoverflow.com/a/36221905/10193818}
 */
export declare function untildify(filePath: string): string;
