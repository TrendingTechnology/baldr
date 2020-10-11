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
export function getExtension(filePath) {
    const segments = filePath.split('.');
    let extension = '';
    if (segments) {
        extension = segments.pop();
    }
    if (extension) {
        return extension.toLowerCase();
    }
}
/**
 * Select a subset of elements by a string (`subsetSelector`). `1` is the first
 * element of the `elements` array.
 *
 * @param subsetSelector - See above.
 * @param options
 */
export function selectSubset(subsetSelector, { sort, elements, elementsCount, firstElementNo, shiftSelector }) {
    const subset = [];
    if (!shiftSelector)
        shiftSelector = 0;
    // Create elements
    if (!elements && elementsCount) {
        elements = [];
        let firstNo;
        if (firstElementNo) {
            firstNo = firstElementNo;
        }
        else {
            firstNo = 0;
        }
        const endNo = firstNo + elementsCount;
        for (let i = firstNo; i < endNo; i++) {
            elements.push(i);
        }
    }
    if (!subsetSelector)
        return elements;
    // 1, 3, 5 -> 1,3,5
    subsetSelector = subsetSelector.replace(/\s*/g, '');
    // 1-3,5-7
    const ranges = subsetSelector.split(',');
    // for cloze steps: shiftSelector = -1
    // shiftSelectorAdjust = 1
    const shiftSelectorAdjust = -1 * shiftSelector;
    for (let range of ranges) {
        // -7 -> 1-7
        if (range.match(/^-/)) {
            const end = parseInt(range.replace('-', ''));
            range = `${1 + shiftSelectorAdjust}-${end}`;
        }
        // 7- -> 7-23
        if (range.match(/-$/)) {
            const begin = parseInt(range.replace('-', ''));
            // for cloze steps (shiftSelector: -1): 7- -> 7-23 -> elements.length
            // as 22 elements because 7-23 translates to 6-22.
            range = `${begin}-${elements.length + shiftSelectorAdjust}`;
        }
        range = range.split('-');
        // 1
        if (range.length === 1) {
            const i = range[0];
            subset.push(elements[i - 1 + shiftSelector]);
            // 1-3
        }
        else if (range.length === 2) {
            const beginNo = parseInt(range[0]) + shiftSelector;
            const endNo = parseInt(range[1]) + shiftSelector;
            if (endNo <= beginNo) {
                throw new Error(`Invalid range: ${beginNo}-${endNo}`);
            }
            for (let no = beginNo; no <= endNo; no++) {
                const index = no - 1;
                subset.push(elements[index]);
            }
        }
    }
    if (sort === 'numeric') {
        subset.sort((a, b) => a - b); // For ascending sort
    }
    else if (sort) {
        subset.sort();
    }
    return subset;
}
/**
 * Sort alphabetically an array of objects by some specific properties.
 *
 * @param property - Key of the object to sort.
 * @see {@link https://ourcodeworld.com/articles/read/764/how-to-sort-alphabetically-an-array-of-objects-by-key-in-javascript Tutorial}
 */
export function sortObjectsByProperty(property) {
    return function (a, b) {
        return a[property].localeCompare(b[property]);
    };
}
/**
 * Format a date specification string into a local date string, for example
 * `28. August 1749`
 *
 * @param dateSpec - A valid input for the `Date()` class. If the
 *   input is invalid the raw `dateSpec` is returned.
 */
export function formatToLocalDate(dateSpec) {
    const date = new Date(dateSpec);
    // Invalid date
    if (isNaN(date.getDay()))
        return dateSpec;
    const months = [
        'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
    ];
    // Not getDay()
    return `${date.getDate()}. ${months[date.getMonth()]} ${date.getFullYear()}`;
}
/**
 * Extract the 4 digit year from a date string
 *
 * @param dateSpec - For example `1968-01-01`.
 *
 * @returns for example `1968`
 */
export function formatToYear(dateSpec) {
    return dateSpec.substr(0, 4);
}
/**
 * Format a timestamp into a string like this example: `Mo 17.2.2020 07:57:53`
 *
 * @param timeStampMsec - The timestamp in milliseconds.
 */
export function formatToLocalDateTime(timeStampMsec) {
    const date = new Date(Number(timeStampMsec));
    const dayNumber = date.getDay();
    let dayString;
    if (dayNumber === 0) {
        dayString = 'So';
    }
    else if (dayNumber === 1) {
        dayString = 'Mo';
    }
    else if (dayNumber === 2) {
        dayString = 'Di';
    }
    else if (dayNumber === 3) {
        dayString = 'Mi';
    }
    else if (dayNumber === 4) {
        dayString = 'Do';
    }
    else if (dayNumber === 5) {
        dayString = 'Fr';
    }
    else if (dayNumber === 6) {
        dayString = 'Sa';
    }
    const dateString = date.toLocaleDateString();
    const timeString = date.toLocaleTimeString();
    return `${dayString} ${dateString} ${timeString}`;
}
/**
 * Convert a duration string (8:01 = 8 minutes 1 seconds or 1:33:12 = 1 hour 33
 * minutes 12 seconds) into seconds.
 */
export function convertDurationToSeconds(duration) {
    if (typeof duration === 'string' && duration.match(/:/)) {
        const segments = duration.split(':');
        if (segments.length === 3) {
            return parseInt(segments[0]) * 3600 + parseInt(segments[1]) * 60 + parseInt(segments[2]);
        }
        else if (segments.length === 2) {
            return parseInt(segments[0]) * 60 + parseInt(segments[1]);
        }
    }
    return Number.parseFloat(duration);
}
/**
 * Convert a single word into title case, for example `word` gets `Word`.
 */
export function toTitleCase(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}
/**
 * Get the plain text version of a HTML string.
 *
 * @param html - A HTML formated string.
 *
 * @returns The plain text version.
 */
export function plainText(html) {
    if (!html)
        return '';
    // To get spaces between heading and paragraphs
    html = html.replace(/></g, '> <');
    const markup = new DOMParser().parseFromString(html, 'text/html');
    return markup.body.textContent || '';
}
/**
 * Shorten a text string. By default the string is shortend to the maximal
 * length 80.
 */
export function shortenText(text, options = {}) {
    if (!text)
        return '';
    let { maxLength, stripTags } = options;
    if (!maxLength)
        maxLength = 80;
    if (stripTags)
        text = plainText(text);
    if (text.length < maxLength)
        return text;
    // https://stackoverflow.com/a/5454303
    // trim the string to the maximum length
    text = text.substr(0, maxLength);
    // re-trim if we are in the middle of a word
    text = text.substr(0, Math.min(text.length, text.lastIndexOf(' ')));
    return `${text} …`;
}
/**
 * Convert `camelCase` into `snake_case` strings.
 *
 * @param str - A camel cased string.
 *
 * @see {@link module:@bldr/core-browser.convertPropertiesCase}
 * @see {@link https://vladimir-ivanov.net/camelcase-to-snake_case-and-vice-versa-with-javascript/}
 */
export function camelToSnake(str) {
    return str.replace(/[\w]([A-Z])/g, function (m) {
        return m[0] + '_' + m[1];
    }).toLowerCase();
}
/**
 * Convert `snake_case` or `kebab-case` strings into `camelCase` strings.
 *
 * @param str - A snake or kebab cased string
 *
 * @see {@link module:@bldr/core-browser.convertPropertiesCase}
 * @see {@link https://catalin.me/javascript-snake-to-camel/}
 */
export function snakeToCamel(str) {
    return str.replace(/([-_][a-z])/g, (group) => group.toUpperCase()
        .replace('-', '')
        .replace('_', ''));
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
export function convertPropertiesCase(data, direction = 'snake-to-camel') {
    // To perserve the order of the props.
    let newObject;
    if (!['snake-to-camel', 'camel-to-snake'].includes(direction)) {
        throw new Error(`convertPropertiesCase: argument direction must be “snake-to-camel” or “camel-to-snake”, got ${direction}`);
    }
    // Array
    if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            if (typeof item === 'object') {
                data[i] = convertPropertiesCase(item, direction);
            }
        }
        // Object
    }
    else if (typeof data === 'object') {
        newObject = {};
        for (const oldProp in data) {
            let newProp;
            if (direction === 'camel-to-snake') {
                newProp = camelToSnake(oldProp);
            }
            else if (direction === 'snake-to-camel') {
                newProp = snakeToCamel(oldProp);
            }
            newObject[newProp] = data[oldProp];
            // Object or array
            if (typeof newObject[newProp] === 'object') {
                newObject[newProp] = convertPropertiesCase(newObject[newProp], direction);
            }
        }
    }
    if (newObject)
        return newObject;
    return data;
}
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
export function formatMultiPartAssetFileName(firstFileName, no) {
    if (!Number.isInteger(no)) {
        // throw new Error(`${firstFileName}: The specifed number “${no}” is no integer.`)
        no = 1;
    }
    let suffix;
    if (no === 1) {
        return firstFileName;
    }
    else if (no < 10) {
        suffix = `_no00${no}`;
    }
    else if (no < 100) {
        suffix = `_no0${no}`;
    }
    else if (no < 1000) {
        suffix = `_no${no}`;
    }
    else {
        throw new Error(`${firstFileName} multipart asset counts greater than 100 are not supported.`);
    }
    return firstFileName.replace(/(\.\w+$)/, `${suffix}$1`);
}
/**
 * https://www.wikidata.org/wiki/Q42
 */
export function formatWikidataUrl(id) {
    id = String(id);
    const wikidataQNumber = parseInt(id.replace(/^Q/, ''));
    // https://www.wikidata.org/wiki/Q42
    return `https://www.wikidata.org/wiki/Q${wikidataQNumber}`;
}
/**
 * https://en.wikipedia.org/wiki/A_Article
 *
 * @param nameSpace - The name space of the Wikipedia article (for
 *   example A_Article or en:A_article)
 */
export function formatWikipediaUrl(nameSpace) {
    // https://de.wikipedia.org/wiki/Gesch%C3%BCtztes_Leerzeichen
    // https://en.wikipedia.org/wiki/Non-breaking_space
    const segments = nameSpace.split(':');
    const lang = segments[0];
    const slug = encodeURIComponent(segments[1]);
    return `https://${lang}.wikipedia.org/wiki/${slug}`;
}
/**
 * Format a Musicbrainz recording URL.
 *
 * `https://musicbrainz.org/recording/${RecordingId}`
 */
export function formatMusicbrainzRecordingUrl(recordingId) {
    return `https://musicbrainz.org/recording/${recordingId}`;
}
/**
 * Format a Musicbrainz work URL.
 *
 * `https://musicbrainz.org/work/${WorkId}`
 */
export function formatMusicbrainzWorkUrl(workId) {
    return `https://musicbrainz.org/work/${workId}`;
}
/**
 * `https://youtu.be/CQYypFMTQcE`
 *
 * @param id - The id of a Youtube video (for example CQYypFMTQcE).
 */
export function formatYoutubeUrl(id) {
    return `https://youtu.be/${id}`;
}
/**
 * `https://imslp.org/wiki/La_clemenza_di_Tito_(Wagenseil,_Georg_Christoph)`
 *
 * @param id - For example
 *   `La_clemenza_di_Tito_(Wagenseil,_Georg_Christoph)`
 */
export function formatImslpUrl(id) {
    return `https://imslp.org/wiki/${id}`;
}
/**
 * `https://commons.wikimedia.org/wiki/File:Cheetah_(Acinonyx_jubatus)_cub.jpg`
 *
 * @param fileName - For example
 *   `Cheetah_(Acinonyx_jubatus)_cub.jpg`
 */
export function formatWikicommonsUrl(fileName) {
    return `https://commons.wikimedia.org/wiki/File:${fileName}`;
}
/**
 * Categories some asset file formats in three asset types: `audio`, `image`,
 * `video`.
 */
export class AssetTypes {
    constructor(config) {
        this.config_ = config.mediaServer.assetTypes;
        this.allowedExtensions_ = this.spreadExtensions_();
    }
    spreadExtensions_() {
        const out = {};
        for (const type in this.config_) {
            for (const extension of this.config_[type].allowedExtensions) {
                out[extension] = type;
            }
        }
        return out;
    }
    /**
     * Get the media type from the extension.
     */
    extensionToType(extension) {
        extension = extension.toLowerCase();
        if (extension in this.allowedExtensions_) {
            return this.allowedExtensions_[extension];
        }
        throw new Error(`Unkown extension “${extension}”`);
    }
    /**
     * Get the color of the media type.
     *
     * @param type - The asset type: for example `audio`, `image`,
     *   `video`.
     */
    typeToColor(type) {
        return this.config_[type].color;
    }
    /**
     * Determine the target extension (for a conversion job) by a given
     * asset type.
     *
     * @param type - The asset type: for example `audio`, `image`,
     *   `video`.
     *
     * @returns {String}
     */
    typeToTargetExtension(type) {
        return this.config_[type].targetExtension;
    }
    /**
     * Check if file is an supported asset format.
     */
    isAsset(filename) {
        const extension = getExtension(filename);
        if (extension && extension in this.allowedExtensions_[extension]) {
            return true;
        }
        return false;
    }
}
/**
 * @see {@link https://coderwall.com/p/ostduq/escape-html-with-javascript}
 */
export function escapeHtml(htmlString) {
    // List of HTML entities for escaping.
    const htmlEscapes = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;'
    };
    // Regex containing the keys listed immediately above.
    const htmlEscaper = /[&<>"'/]/g;
    // Escape a string for HTML interpolation.
    return ('' + htmlString).replace(htmlEscaper, function (match) {
        return htmlEscapes[match];
    });
}
/**
 * Create a deep copy of an object. This functions uses the two methods
 * `JSON.parse()` and `JSON.stringify()` to accomplish its task.
 */
export function deepCopy(data) {
    return JSON.parse(JSON.stringify(data));
}
/**
 * @link {@see https://www.npmjs.com/package/js-yaml}
 */
export const jsYamlConfig = {
    noArrayIndent: true,
    lineWidth: 72,
    noCompatMode: true
};
/**
 * Create a deep copy of and object.
 */
export class RawDataObject {
    constructor(rawData) {
        /**
         * The raw data object.
         *
         * @type {Object}
         */
        this.raw = deepCopy(rawData);
    }
    /**
     * Cut a property from the raw object, that means delete the property and
     * return the value.
     *
     * @param property - The property of the object.
     *
     * @returns The data stored in the property
     */
    cut(property) {
        if ({}.hasOwnProperty.call(this.raw, property)) {
            const out = this.raw[property];
            delete this.raw[property];
            return out;
        }
    }
    /**
     * Assert if the raw data object is empty.
     */
    isEmpty() {
        if (Object.keys(this.raw).length === 0)
            return true;
        return false;
    }
}
/**
 * Regular expression to detect media URIs.
 *
 * Possible URIs are: `id:Rhythm-n-Blues-Rock-n-Roll_BD_Bill-Haley#complete`
 * `uuid:c262fe9b-c705-43fd-a5d4-4bb38178d9e7`
 */
export const mediaUriRegExp = new RegExp('((id|uuid):(([a-zA-Z0-9-_]+)(#([a-zA-Z0-9-_]+))?))');
/**
 *
 * @see {@link https://github.com/erikdubbelboer/node-sleep}
 *
 * @param {Number} milliSeconds
 */
export function msleep(milliSeconds) {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, milliSeconds);
}
export default {
    convertDurationToSeconds,
    formatImslpUrl,
    formatMusicbrainzRecordingUrl,
    formatMusicbrainzWorkUrl,
    formatWikicommonsUrl,
    formatWikidataUrl,
    formatWikipediaUrl,
    formatYoutubeUrl,
    mediaUriRegExp
};
