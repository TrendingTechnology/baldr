interface MasterProps {
    language: string;
    title: string;
    oldid?: number;
}
/**
 * @param title - The title of a Wikipedia page (for example
 *   `Wolfgang Amadeus Mozart` or `Ludwig_van_Beethoven`).
 * @param language - A Wikipedia language code (for example `de`, `en`)
 *   {@link https://en.wikipedia.org/wiki/List_of_Wikipedias}.
 *
 * @see {@link https://www.mediawiki.org/wiki/Extension:PageImages}
 */
export declare function getFirstImage(title: string, language?: string): Promise<string | undefined>;
/**
 * @param title - The title of a Wikipedia page (for example
 *   `Wolfgang Amadeus Mozart` or `Ludwig_van_Beethoven`).
 * @param language - A Wikipedia language code (for example `de`, `en`)
 *   {@link https://en.wikipedia.org/wiki/List_of_Wikipedias}.
 *
 * @see {@link https://www.mediawiki.org/wiki/API:Get_the_contents_of_a_page}
 * @see {@link https://www.mediawiki.org/wiki/API:Parsing_wikitext}
 */
export declare function getHtmlBody(title: string, language: string, oldid?: number): Promise<string | undefined>;
/**
 * Used for the Vuex store as a key.
 */
export declare function formatId(language: string, title: string): string;
export declare function formatUrl(props: MasterProps): string;
export {};
