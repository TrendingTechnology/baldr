/**
 * A naive implementation of a TeX to Markdown and vice versa converter.
 *
 * @module @bldr/tex-markdown-converter
 */
/**
  * A replacement using a regular expression.
  */
export interface RegExpReplacement {
    /**
     * A regular expression.
     */
    reg: RegExp;
    /**
     * A replacement string.
     */
    rep: string;
}
/**
 * A replacement pair: A TeX snippet and a corresponding Markdown snippet.
 */
export interface ReplacementPair {
    /**
     * The TeX side of the replacement pair.
     */
    tex: string | RegExpReplacement;
    /**
     * The markdown side of the replacement pair.
     */
    md: string | RegExpReplacement;
}
/**
 * Build and assemble strings to generate regular expressions from.
 */
declare class RegExpBuilder {
    dotAll: string;
    captDotAll: string;
    whiteNewline: string;
    constructor();
    /**
     * Format a capture group `(regexp)`.
     *
     * @param regExp - A string to build a regular expression from.
     *
     * @returns A string to build a regular expression from.
     */
    capt(regExp: string): string;
    /**
     * Assemble a regular expression string to capture a TeX macro / command
     * `\makroName{}`.
     *
     * @param macroName
     * @param regExp - A string to build a regular expression from.
     *
     * @returns A string to build a regular expression from.
     */
    cmd(macroName: string, regExp?: string): string;
    /**
     * Build a regular expression for a TeX environment.
     *
     * @param envName - The name of the environment.
     * @param regExp - A string to build a regular expression from.
     *
     * @returns A string to build a regular expression from.
     */
    env(envName: string, regExp?: string): string;
}
export declare const regBuilder: RegExpBuilder;
/**
 *
 * @param match
 * @param excludeCaptureGroups - An array of capture group strings
 *   to exclude in the result matches for example regexp:
 *   `(itemize|compactitem|sub)` -> `['itemize', 'compactitem', 'sub']`
 */
declare function cleanMatch(match: string[], excludeCaptureGroups: string[]): string[];
/**
 * @param text - Text to search for matches
 * @param regExp - Regular expressed gets compiled
 * @param matches - Array gets filled with cleaned matches.
 * @param excludeCaptureGroups - An array of capture group strings
 *   to exclude in the result matches for example regex:
 *   `(itemize|compactitem|sub)` -> `['itemize', 'compactitem', 'sub']`
 *
 * @returns {string}
 */
export declare function extractMatchAll(text: string, regExp: string, matches: string[][], excludeCaptureGroups: string[]): string;
/**
 *
 * @param {string} text - A input string to convert.
 *
 * @see {@link https://tex.stackexchange.com/a/451849/42311}
 */
export declare function removeTexComments(text: string): string;
/**
 * Convert an TeX text to a Markdown text.
 *
 * @param text An input text in the TeX format.
 *
 * @returns A string in the Markdown format.
 */
export declare function convertTexToMd(text: string): string;
/**
 * Convert an Markdown text to a TeX text.
 *
 * @param text An input text in the Markdown format.
 *
 * @returns A string in the TeX format.
 */
export declare function convertMdToTex(text: string): string;
interface TexObject {
    [key: string]: any;
}
declare type TexObjectArray = TexObject[];
/**
 *
 * @param content A TeX string.
 */
export declare function objectifyTexZitat(content: string): TexObjectArray;
export declare function objectifyTexItemize(content: string): TexObjectArray;
declare const _default: {
    regBuilder: RegExpBuilder;
    cleanMatch: typeof cleanMatch;
    extractMatchAll: typeof extractMatchAll;
    removeComments: typeof removeTexComments;
};
export default _default;
