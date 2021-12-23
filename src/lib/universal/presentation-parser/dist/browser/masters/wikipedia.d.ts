import { Master } from '../master';
/**
 * Used to store the body text and the preview image url.
 */
export declare function formatWikipediaId(title: string, language: string, oldid?: number): string;
export declare function formatTitleHumanReadable(title: string): string;
export declare function formatTitleForLink(fields: WikipediaFieldsNormalized): string;
export declare function formatUrl(fields: WikipediaFieldsNormalized): string;
export declare const cache: {
    bodies: {
        [id: string]: string;
    };
    thumbnailUrls: {
        [id: string]: string;
    };
};
/**
 * @param title - The title of a Wikipedia page (for example
 *   `Wolfgang Amadeus Mozart` or `Ludwig_van_Beethoven`).
 * @param language - A Wikipedia language code (for example `de`, `en`)
 *   {@link https://en.wikipedia.org/wiki/List_of_Wikipedias}.
 *
 * @see {@link https://www.mediawiki.org/wiki/Extension:PageImages}
 */
export declare function queryFirstImage(title: string, language?: string): Promise<string | undefined>;
export declare function getFirstImage(wikipediaId: string): string;
/**
 * @param title - The title of a Wikipedia page (for example
 *   `Wolfgang Amadeus Mozart` or `Ludwig_van_Beethoven`).
 * @param language - A Wikipedia language code (for example `de`, `en`)
 *   {@link https://en.wikipedia.org/wiki/List_of_Wikipedias}.
 *
 * @see {@link https://www.mediawiki.org/wiki/API:Get_the_contents_of_a_page}
 * @see {@link https://www.mediawiki.org/wiki/API:Parsing_wikitext}
 */
export declare function queryHtmlBody(title: string, language: string, oldid?: number): Promise<string | undefined>;
export declare function getHtmlBody(title: string, language: string, oldid?: number): string;
declare type WikipediaFieldsRaw = string | WikipediaFieldsNormalized;
export interface WikipediaFieldsNormalized {
    title: string;
    language: string;
    oldid?: number;
}
export declare class WikipediaMaster implements Master {
    name: string;
    displayName: string;
    icon: {
        name: string;
        color: string;
        /**
         * U+26AA
         *
         * @see https://emojipedia.org/white-circle/
         */
        unicodeSymbol: string;
    };
    fieldsDefintion: {
        title: {
            type: StringConstructor;
            required: boolean;
            description: string;
        };
        language: {
            type: StringConstructor;
            description: string;
            default: string;
        };
        oldid: {
            type: NumberConstructor;
            description: string;
        };
    };
    normalizeFieldsInput(fields: WikipediaFieldsRaw): WikipediaFieldsNormalized;
}
export {};
