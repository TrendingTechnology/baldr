/**
 * Convert some unicode strings into the ASCII format.
 *
 * @param {String} input
 *
 * @returns {String}
 */
export function asciify(input: string): string;
/**
 * This function can be used to generate IDs from different file names.
 *
 * It performes some addictional replacements which can not be done in `asciify`
 * (`asciffy` is sometimes applied to paths.)
 *
 * @param {String} input
 *
 * @return {String}
 */
export function idify(input: string): string;
/**
 * This function can be used to generate a title from an ID string.
 *
 * @param {String} input
 *
 * @returns {String}
 */
export function deasciify(input: string): string;
