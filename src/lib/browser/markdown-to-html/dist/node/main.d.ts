/**
 * Convert a string from the Markdown format into the HTML format.
 *
 * @param text - A string in the Markdown format.
 */
export declare function convertMarkdownStringToHtml(text: string): string;
declare type Any = string | string[] | {
    [key: string]: Any;
};
/**
 * Convert Markdown texts into HTML texts.
 *
 * The conversion is done in a recursive fashion, that means
 * strings nested in objects or arrays are also converted.
 *
 * @param input - Various input types
 */
export declare function convertMarkdownToHtml(input: Any): Any;
export {};
