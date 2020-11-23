declare type Any = string | string[] | {
    [key: string]: Any;
};
/**
 * Convert Mardown texts into HTML texts.
 *
 * The conversion is done in a recursive fashion, that means in object or array
 * nested strings are also converted.
 *
 * @param input - Various input types
 */
export declare function convertMarkdownToHtml(input: Any): Any;
export {};
