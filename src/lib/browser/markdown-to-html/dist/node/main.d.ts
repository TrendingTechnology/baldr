/**
 * Convert a string from the Markdown format into the HTML format.
 *
 * @param text - A string in the Markdown format.
 */
export declare function convertMarkdownToHtml(text: string): string;
declare type NestedMarkdown = string | string[] | {
    [key: string]: NestedMarkdown;
};
/**
 * Convert Markdown texts into HTML texts.
 *
 * The conversion is done in a recursive fashion, that means
 * strings nested in objects or arrays are also converted.
 *
 * @param input - Various input types
 */
export declare function convertNestedMarkdownToHtml(input: NestedMarkdown): NestedMarkdown;
export {};
