/**
 * Base core functionality for the code running in the browser without node.
 *
 * Run `npm run build` to build the node version of this code. The node
 * version uses the CommonJS module system instead of the ES module system.
 *
 * @module @bldr/core-browser
 */
/**
 * Get the extension from a file path.
 *
 * @param filePath - A file path or a single file name.
 *
 * @returns - The extension in lower case characters.
 */
export declare function getExtension(filePath: string): string | undefined;
/**
 * Select a subset of elements. Examples
 *
 * - `` (emtpy string or value which evalutes to false): All elements.
 * - `1`: The first element.
 * - `1,3,5`: The first, the third and the fifth element.
 * - `1-3,5-7`: `1,2,3,5,6,7`
 * - `-7`: All elements from the beginning up to `7` (`1-7`).
 * - `7-`: All elements starting from `7` (`7-end`).
 */
declare type SubsetSelector = string;
interface SelectSubsetConfiguration {
    /**
     * `numeric`, or a truety value.
     */
    sort: string;
    /**
     * An array of elements to build a subset from.
     */
    elements: any[];
    /**
     * If `elements` is undefined, an array with integers is created und
     * used as `elements`.
     */
    elementsCount: number;
    firstElementNo: number;
    /**
     * Shift all selector numbers by
    *   this number: For example `-1`: `2-5` is internally treated as `1-4`
     */
    shiftSelector: number;
}
/**
 * Select a subset of elements by a string (`subsetSelector`). `1` is the first
 * element of the `elements` array.
 *
 * @param subsetSelector - See above.
 * @param options
 */
export declare function selectSubset(subsetSelector: SubsetSelector, { sort, elements, elementsCount, firstElementNo, shiftSelector }: SelectSubsetConfiguration): any[];
/**
 * Sort alphabetically an array of objects by some specific properties.
 *
 * @param property - Key of the object to sort.
 * @see {@link https://ourcodeworld.com/articles/read/764/how-to-sort-alphabetically-an-array-of-objects-by-key-in-javascript Tutorial}
 */
export declare function sortObjectsByProperty(property: string): Function;
/**
 * Format a date specification string into a local date string, for example
 * `28. August 1749`
 *
 * @param dateSpec - A valid input for the `Date()` class. If the
 *   input is invalid the raw `dateSpec` is returned.
 */
export declare function formatToLocalDate(dateSpec: string): string;
/**
 * Extract the 4 digit year from a date string
 *
 * @param dateSpec - For example `1968-01-01`.
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
 * Convert a duration string (8:01 = 8 minutes 1 seconds or 1:33:12 = 1 hour 33
 * minutes 12 seconds) into seconds.
 */
export declare function convertDurationToSeconds(duration: string): number;
/**
 * Convert a single word into title case, for example `word` gets `Word`.
 */
export declare function toTitleCase(text: string): string;
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
 */
export declare function shortenText(text: string, options?: ShortenTextOptions): string;
/**
 * Convert `camelCase` into `snake_case` strings.
 *
 * @param str - A camel cased string.
 *
 * @see {@link module:@bldr/core-browser.convertPropertiesCase}
 * @see {@link https://vladimir-ivanov.net/camelcase-to-snake_case-and-vice-versa-with-javascript/}
 */
export declare function camelToSnake(str: string): string;
/**
 * Convert `snake_case` or `kebab-case` strings into `camelCase` strings.
 *
 * @param str - A snake or kebab cased string
 *
 * @see {@link module:@bldr/core-browser.convertPropertiesCase}
 * @see {@link https://catalin.me/javascript-snake-to-camel/}
 */
export declare function snakeToCamel(str: string): string;
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
export declare function convertPropertiesCase(data: any, direction?: string): object;
/**
 * Generate from the file name or the url of the first element of a multipart
 * asset the nth file name or the url. The parameter `firstFileName` must
 * have a extension (for example `.jpg`). The parameter `no` must be smaller
 * then 100. Only two digit or smaller integers are allowed.
 *
 * 1. `multipart-asset.jpg`
 * 2. `multipart-asset_no02.jpg`
 * 3. `multipart-asset_no03.jpg`
 * 4. ...
 *
 * @param firstFileName - A file name, a path or a URL.
 * @param no - The number in the multipart asset list. The first
 *   element has the number 1.
 */
export declare function formatMultiPartAssetFileName(firstFileName: string, no: number): string;
/**
 * https://www.wikidata.org/wiki/Q42
 */
export declare function formatWikidataUrl(id: string): string;
/**
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
 */
export declare function formatMusicbrainzRecordingUrl(recordingId: string): string;
/**
 * Format a Musicbrainz work URL.
 *
 * `https://musicbrainz.org/work/${WorkId}`
 */
export declare function formatMusicbrainzWorkUrl(workId: string): string;
/**
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
 * Categories some asset file formats in three asset types: `audio`, `image`,
 * `video`.
 */
export declare class AssetTypes {
    private config_;
    private allowedExtensions_;
    constructor(config: any);
    private spreadExtensions_;
    /**
     * Get the media type from the extension.
     */
    extensionToType(extension: string): string;
    /**
     * Get the color of the media type.
     *
     * @param type - The asset type: for example `audio`, `image`,
     *   `video`.
     */
    typeToColor(type: string): string;
    /**
     * Determine the target extension (for a conversion job) by a given
     * asset type.
     *
     * @param type - The asset type: for example `audio`, `image`,
     *   `video`.
     *
     * @returns {String}
     */
    typeToTargetExtension(type: string): string;
    /**
     * Check if file is an supported asset format.
     */
    isAsset(filename: string): boolean;
}
/**
 * @see {@link https://coderwall.com/p/ostduq/escape-html-with-javascript}
 */
export declare function escapeHtml(htmlString: string): string;
/**
 * Create a deep copy of an object. This functions uses the two methods
 * `JSON.parse()` and `JSON.stringify()` to accomplish its task.
 */
export declare function deepCopy(data: object): object;
/**
 * @link {@see https://www.npmjs.com/package/js-yaml}
 */
export declare const jsYamlConfig: {
    noArrayIndent: boolean;
    lineWidth: number;
    noCompatMode: boolean;
};
interface RawObject {
    [key: string]: any;
}
/**
 * Create a deep copy of and object.
 */
export declare class RawDataObject {
    raw: RawObject;
    constructor(rawData: RawObject);
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
 * Regular expression to detect media URIs.
 *
 * Possible URIs are: `id:Rhythm-n-Blues-Rock-n-Roll_BD_Bill-Haley#complete`
 * `uuid:c262fe9b-c705-43fd-a5d4-4bb38178d9e7`
 */
export declare const mediaUriRegExp: RegExp;
/**
 *
 * @see {@link https://github.com/erikdubbelboer/node-sleep}
 *
 * @param {Number} milliSeconds
 */
export declare function msleep(milliSeconds: number): void;
declare const _default: {
    convertDurationToSeconds: typeof convertDurationToSeconds;
    formatImslpUrl: typeof formatImslpUrl;
    formatMusicbrainzRecordingUrl: typeof formatMusicbrainzRecordingUrl;
    formatMusicbrainzWorkUrl: typeof formatMusicbrainzWorkUrl;
    formatWikicommonsUrl: typeof formatWikicommonsUrl;
    formatWikidataUrl: typeof formatWikidataUrl;
    formatWikipediaUrl: typeof formatWikipediaUrl;
    formatYoutubeUrl: typeof formatYoutubeUrl;
    mediaUriRegExp: RegExp;
};
export default _default;
