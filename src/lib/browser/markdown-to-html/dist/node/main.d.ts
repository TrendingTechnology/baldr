/**
 * Convert a string from the Markdown format into the HTML format.
 *
 * @param text - A string in the Markdown format.
 */
export declare function convertMarkdownFromString(text: string): string;
declare type Any = string | string[] | {
    [key: string]: Any;
};
/**
 * Convert the specifed text to HTML. At the moment Markdown and HTML formats
 * are supported. The conversion is done in a recursive fashion, that means
 * nested strings are also converted.
 *
 * @param input - Various input types
 */
export declare function convertMarkdownFromAny(input: Any): Any;
export {};
