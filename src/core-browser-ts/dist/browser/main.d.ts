/**
 * Base core functionality for the code running in the browser without node.
 *
 * Run `npm run build` to build the node version of this code. The node
 * version uses the CommonJS module system instead of the ES module system.
 *
 * @module @bldr/core-browser-ts
 */
export * from './asset-types';
/**
 * Create a deep copy of an object. This functions uses the two methods
 * `JSON.parse()` and `JSON.stringify()` to accomplish its task.
 *
 * @param data
 */
export declare function deepCopy(data: object): object;
/**
 * Get the extension from a file path.
 *
 * @param filePath - A file path or a single file name.
 *
 * @returns The extension in lower case characters.
 */
export declare function getExtension(filePath: string): string | undefined;
/**
 * Convert `camelCase` into `snake_case` strings.
 *
 * @param text - A camel cased string.
 *
 * @returns A string formatted in `snake_case`.
 *
 * @see {@link module:@bldr/core-browser.convertPropertiesCase}
 * @see {@link https://vladimir-ivanov.net/camelcase-to-snake_case-and-vice-versa-with-javascript/}
 */
export declare function camelToSnake(text: string): string;
/**
 * Convert `snake_case` or `kebab-case` strings into `camelCase` strings.
 *
 * @param text - A snake or kebab cased string
 *
 * @returns A string formatted in `camelCase`.
 *
 * @see {@link module:@bldr/core-browser.convertPropertiesCase}
 * @see {@link https://catalin.me/javascript-snake-to-camel/}
 */
export declare function snakeToCamel(text: string): string;
declare enum PropertyConvertDirection {
    SNAKE_TO_CAMEL = 0,
    CAMEL_TO_SNAKE = 1
}
/**
 * Convert all properties in an object from `snake_case` to `camelCase` or vice
 * versa in a recursive fashion.
 *
 * @param data - Some data in various formats.
 * @param direction - `snake-to-camel` or `camel-to-snake`
 *
 * @returns Possibly an new object is returned. One should always
 *   use this returned object.
 */
export declare function convertProperties(data: any, direction?: PropertyConvertDirection): object;
/**
 * Convert all properties in an object from `snake_case` to `camelCase`.
 *
 * @param data - Some data in various formats.
 *
 * @returns Possibly an new object is returned. One should always use
 *   this returned object. Do not rely on the by reference passed in
 *   object `data`.
 */
export declare function convertPropertiesSnakeToCamel(data: any): object;
/**
 * Convert all properties in an object from `camelCase` to `snake_case`.
 *
 * @param data - Some data in various formats.
 *
 * @returns Possibly an new object is returned. One should always use
 *   this returned object. Do not rely on the by reference passed in
 *   object `data`.
 */
export declare function convertPropertiesCamelToSnake(data: any): object;
/**
 * @link {@see https://www.npmjs.com/package/js-yaml}
 */
export declare const jsYamlConfig: {
    noArrayIndent: boolean;
    lineWidth: number;
    noCompatMode: boolean;
};
/**
 * Regular expression to detect media URIs.
 *
 * Possible URIs are: `id:Rhythm-n-Blues-Rock-n-Roll_BD_Bill-Haley#complete`
 * `uuid:c262fe9b-c705-43fd-a5d4-4bb38178d9e7`
 */
export declare const mediaUriRegExp: RegExp;
/**
 * Sleep some time
 *
 * @see {@link https://github.com/erikdubbelboer/node-sleep}
 *
 * @param milliSeconds
 */
export declare function msleep(milliSeconds: number): void;
/**
 * Create a deep copy of and object.
 */
export declare class RawDataObject {
    /**
     * The raw data object.
     */
    raw: {
        [key: string]: any;
    };
    constructor(rawData: object);
    /**
     * Cut a property from the raw object, that means delete the property and
     * return the value.
     *
     * @param property - The property of the object.
     *
     * @returns The data stored in the property
     */
    cut(property: string): any;
    /**
     * Assert if the raw data object is empty.
     */
    isEmpty(): boolean;
}
/**
 * Escape some characters with HTML entities.
 *
 * @see {@link https://coderwall.com/p/ostduq/escape-html-with-javascript}
 */
export declare function escapeHtml(htmlString: string): string;
/**
 * Generate from the file name or the url of the first element of a
 * multipart asset the nth file name or the url. The parameter
 * `firstFileName` must have a extension (for example `.jpg`). The
 * parameter `no` must be smaller then 100. Only two digit or smaller
 * integers are allowed.
 *
 * 1. `multipart-asset.jpg`
 * 2. `multipart-asset_no02.jpg`
 * 3. `multipart-asset_no03.jpg`
 * 4. ...
 *
 * @param firstFileName - A file name, a path or a URL.
 * @param no - The number in the multipart asset list. The
 *   first element has the number 1.
 */
export declare function formatMultiPartAssetFileName(firstFileName: string, no: string | number): string;
/**
 * Format a Wikidata URL.
 * `https://www.wikidata.org/wiki/Q42`
 */
export declare function formatWikidataUrl(id: string): string;
/**
 * Format a Wikipedia URL.
 *
 * https://en.wikipedia.org/wiki/A_Article
 *
 * @param nameSpace - The name space of the Wikipedia article (for
 *   example A_Article or en:A_article)
 */
export declare function formatWikipediaUrl(nameSpace: string): string;
/**
 * Format a Musicbrainz recording URL.
 *
 * `https://musicbrainz.org/recording/${RecordingId}`
 *
 * @param recordingId
 */
export declare function formatMusicbrainzRecordingUrl(recordingId: string): string;
/**
 * Format a Musicbrainz work URL.
 *
 * `https://musicbrainz.org/work/${WorkId}`
 *
 * @param workId
 */
export declare function formatMusicbrainzWorkUrl(workId: string): string;
/**
 * Format a YouTube URL.
 *
 * `https://youtu.be/CQYypFMTQcE`
 *
 * @param id - The id of a Youtube video (for example CQYypFMTQcE).
 */
export declare function formatYoutubeUrl(id: string): string;
/**
 * `https://imslp.org/wiki/La_clemenza_di_Tito_(Wagenseil,_Georg_Christoph)`
 *
 * @param id - For example
 *   `La_clemenza_di_Tito_(Wagenseil,_Georg_Christoph)`
 */
export declare function formatImslpUrl(id: string): string;
/**
 * `https://commons.wikimedia.org/wiki/File:Cheetah_(Acinonyx_jubatus)_cub.jpg`
 *
 * @param fileName - For example
 *   `Cheetah_(Acinonyx_jubatus)_cub.jpg`
 */
export declare function formatWikicommonsUrl(fileName: string): string;
/**
 * Get the plain text version of a HTML string.
 *
 * @param html - A HTML formated string.
 *
 * @returns The plain text version.
 */
export declare function plainText(html: string): string;
interface ShortenTextOptions {
    stripTags: boolean;
    maxLength: number;
}
/**
 * Shorten a text string. By default the string is shortend to the maximal
 * length 80.
 *
 * @param text
 * @param options
 */
export declare function shortenText(text: string, { maxLength, stripTags }: ShortenTextOptions): string;
interface SelectionSubsetOption {
    /**
     * `numeric`, or a truety value.
     */
    sort: string | boolean;
    /**
     * An array of elements to build a subset
     */
    elements: any[];
    /**
     * If `elements` is undefined, an array with integers is created und
     * used as `elements`.
     */
    elementsCount: number;
    /**
     *
     */
    firstElementNo: number;
    /**
     * Shift all selector numbers by this number: For example `-1`: `2-5`
     *   is internally treated as `1-4`
     */
    shiftSelector: number;
}
/**
 * Select a subset of elements by a string (`subsetSelector`). `1` is the first
 * element of the `elements` array.
 *
 * @param subsetSelector - Select a subset of elements. Examples
 *
 * - `` (emtpy string or value which evalutes to false): All elements.
 * - `1`: The first element.
 * - `1,3,5`: The first, the third and the fifth element.
 * - `1-3,5-7`: `1,2,3,5,6,7`
 * - `-7`: All elements from the beginning up to `7` (`1-7`).
 * - `7-`: All elements starting from `7` (`7-end`).
 *
 * @param options
 *
 * @returns {Array}
 */
export declare function selectSubset(subsetSelector: string, { sort, elements, elementsCount, firstElementNo, shiftSelector }: SelectionSubsetOption): any[];
/**
 * Sort alphabetically an array of objects by some specific properties.
 *
 * @param property - Key of the object to sort.
 * @see {@link https://ourcodeworld.com/articles/read/764/how-to-sort-alphabetically-an-array-of-objects-by-key-in-javascript Tutorial}
 */
export declare function sortObjectsByProperty(property: string): (a: {
    [key: string]: any;
}, b: {
    [key: string]: any;
}) => any;
/**
 * Format a date specification string into a local date string, for
 * example `28. August 1749`
 *
 * @param dateSpec - A valid input for the `Date()` class. If the input
 *   is invalid the raw `dateSpec` is returned.
 */
export declare function formatToLocalDate(dateSpec: string): string;
/**
 * Extract the 4 digit year from a date string
 *
 * @param dateSpec - For example `1968-01-01`
 *
 * @returns for example `1968`
 */
export declare function formatToYear(dateSpec: string): string;
/**
 * Format a timestamp into a string like this example: `Mo 17.2.2020 07:57:53`
 *
 * @param timeStampMsec - The timestamp in milliseconds.
 */
export declare function formatToLocalDateTime(timeStampMsec: number): string;
/**
 * Convert a duration string (8:01 = 8 minutes 1 seconds or 1:33:12 = 1
 * hour 33 minutes 12 seconds) into seconds.
 *
 * @param duration
 */
export declare function convertDurationToSeconds(duration: string): number;
/**
 * Convert a single word into title case, for example `word` gets `Word`.
 *
 * @param text
 */
export declare function toTitleCase(text: string): string;
