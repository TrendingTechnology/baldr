/**
 * A small transliterate library. Based on
 * https://github.com/sindresorhus/transliterate/blob/main/index.js
 */
declare type Replacements = Array<[key: string, value: string]>;
interface Options {
    customReplacements: Replacements;
}
export declare function transliterate(string: string, options?: Options): string;
export {};
