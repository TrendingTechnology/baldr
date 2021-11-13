/**
 * Base core functionality for the code running in the browser without node.
 *
 * Run `npm run build` to build the node version of this code. The node
 * version uses the CommonJS module system instead of the ES module system.
 *
 * @module @bldr/core-browser
 */
import { v4 as uuidv4 } from 'uuid';
export * from './object-manipulation';
export * from './string-format';
/**
 * Get the extension from a file path.
 *
 * @param filePath - A file path or a single file name.
 *
 * @returns The extension in lower case characters.
 */
export function getExtension(filePath) {
    if (filePath != null) {
        const extension = String(filePath)
            .split('.')
            .pop();
        if (extension != null) {
            return extension.toLowerCase();
        }
    }
}
/**
 * Sleep some time
 *
 * @see {@link https://github.com/erikdubbelboer/node-sleep}
 *
 * @param milliSeconds
 */
export function msleep(milliSeconds) {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, milliSeconds);
}
class SubsetRange {
    constructor(from, to) {
        this.from = from;
        this.to = to;
    }
}
function parseSubsetSpecifier(specifier) {
    if (specifier.match(/[^\d\s,-]/) != null) {
        throw new Error(`Only the following characters are allowed as subset specifiers: “0123456789-,” not “${specifier}”`);
    }
    specifier = specifier.replace(/\s*/g, '');
    // 1-3,5-7
    const ranges = [];
    const rangeSpecs = specifier.split(',');
    for (const rangeSpec of rangeSpecs) {
        // 7 -> 7-7
        if (!rangeSpec.includes('-')) {
            const both = parseInt(rangeSpec);
            ranges.push(new SubsetRange(both, both));
            // -7 -> 1-7
        }
        else if (rangeSpec.match(/^-\d+$/) != null) {
            const to = parseInt(rangeSpec.replace('-', ''));
            ranges.push(new SubsetRange(1, to));
            // 7- -> 7-?
        }
        else if (rangeSpec.match(/^\d+-$/) != null) {
            const from = parseInt(rangeSpec.replace('-', ''));
            ranges.push(new SubsetRange(from));
            // 7-8 or 7-7
        }
        else if (rangeSpec.match(/^\d+-\d+$/) != null) {
            const rangeSplit = rangeSpec.split('-');
            const from = parseInt(rangeSplit[0]);
            const to = parseInt(rangeSplit[1]);
            if (to < from) {
                throw new Error(`Invalid range: ${from}-${to}`);
            }
            ranges.push(new SubsetRange(from, to));
        }
        else {
            throw new Error('Invalid range specifier');
        }
    }
    return ranges;
}
export function buildSubsetIndexes(specifier, elementCount, indexShift = -1) {
    const ranges = parseSubsetSpecifier(specifier);
    const indexes = new Set();
    for (const range of ranges) {
        const to = range.to == null ? elementCount : range.to;
        for (let index = range.from; index <= to; index++) {
            indexes.add(index);
        }
    }
    const indexesArray = Array.from(indexes);
    indexesArray.sort((a, b) => a - b);
    const shiftedArray = [];
    for (const index of indexesArray) {
        const newIndex = index + indexShift;
        if (newIndex < 0) {
            throw new Error(`The index must be greater than 0: ${newIndex} (specifier: “${specifier}”, element count: ${elementCount}, index shift: ${indexShift})`);
        }
        shiftedArray.push(newIndex);
    }
    return shiftedArray;
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
 */
export function selectSubset(subsetSelector, { sort, elements, elementsCount, firstElementNo, shiftSelector }) {
    const subset = [];
    if (shiftSelector == null)
        shiftSelector = 0;
    // Create elements
    if (elements == null && elementsCount != null) {
        elements = [];
        let firstNo;
        if (firstElementNo != null) {
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
    if (elements == null)
        elements = [];
    if (subsetSelector == null || subsetSelector === '')
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
        if (range.match(/^-/) != null) {
            const end = parseInt(range.replace('-', ''));
            range = `${1 + shiftSelectorAdjust}-${end}`;
        }
        // 7- -> 7-23
        if (range.match(/-$/) != null) {
            const begin = parseInt(range.replace('-', ''));
            // for cloze steps (shiftSelector: -1): 7- -> 7-23 -> elements.length
            // as 22 elements because 7-23 translates to 6-22.
            range = `${begin}-${elements.length + shiftSelectorAdjust}`;
        }
        const rangeSplit = range.split('-');
        let startEnd;
        if (rangeSplit.length === 2) {
            startEnd = [parseInt(rangeSplit[0]), parseInt(rangeSplit[1])];
        }
        else {
            startEnd = [parseInt(rangeSplit[0])];
        }
        // 1
        if (startEnd.length === 1) {
            const i = startEnd[0];
            subset.push(elements[i - 1 + shiftSelector]);
            // 1-3
        }
        else if (startEnd.length === 2) {
            const beginNo = startEnd[0] + shiftSelector;
            const endNo = startEnd[1] + shiftSelector;
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
    else if (typeof sort === 'boolean' && sort) {
        subset.sort(undefined);
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
 * TODO: Remove use class MediaUri()
 *
 * Check if the input is a valid URI. Prefix with `ref:` if necessary.
 *
 * @param uri - The URI to validate.
 */
export function validateUri(uri) {
    const segments = uri.split(':');
    // To allow URI with out a URI scheme. This defaults to `id`.
    if (segments.length === 1) {
        uri = `ref:${uri}`;
    }
    return uri;
}
/**
 * Split a HTML text into smaller chunks by looping over the children.
 *
 * @param htmlString - A HTML string.
 * @param charactersOnSlide - The maximum number of characters that may be
 *   contained in a junk.
 *
 * @returns An array of HTML chunks.
 */
export function splitHtmlIntoChunks(htmlString, charactersOnSlide) {
    /**
     * Add text to the chunks array. Add only text with real letters not with
     * whitespaces.
     *
     * @param htmlChunks - The array to be filled with HTML chunks.
     * @param htmlString - A HTML string to be added to the array.
     */
    function addHtml(htmlChunks, htmlString) {
        if (htmlString != null && htmlString.match(/^\s*$/) == null) {
            htmlChunks.push(htmlString);
        }
    }
    if (htmlString.length < charactersOnSlide)
        return [htmlString];
    const domParser = new DOMParser();
    let dom = domParser.parseFromString(htmlString, 'text/html');
    // If htmlString is a text without tags
    if (dom.body.children.length === 0) {
        dom = domParser.parseFromString(`<p>${htmlString}</p>`, 'text/html');
    }
    let text = '';
    const htmlChunks = [];
    // childNodes not children!
    for (const children of dom.body.childNodes) {
        const element = children;
        // If htmlString is a text with inner tags
        if (children.nodeName === '#text') {
            if (element.textContent != null)
                text += `${element.textContent}`;
        }
        else {
            if (element.outerHTML != null)
                text += `${element.outerHTML}`;
        }
        if (text.length > charactersOnSlide) {
            addHtml(htmlChunks, text);
            text = '';
        }
    }
    // Add last not full text
    addHtml(htmlChunks, text);
    return htmlChunks;
}
/**
 * TODO: Remove -> use Set()
 *
 * Remove duplicates from an array. A new array is created and returned.
 *
 * @param input - An array with possible duplicate entries.
 *
 * @returns A new array with no duplicates.
 */
export function removeDuplicatesFromArray(input) {
    const output = [];
    for (const value of input) {
        if (!output.includes(value)) {
            output.push(value);
        }
    }
    return output;
}
/**
 * Make a set of strings.
 *
 * @param values - Some strings to add to the set
 *
 * @returns A new set.
 */
export function makeSet(values) {
    if (typeof values === 'string') {
        return new Set([values]);
    }
    else if (Array.isArray(values)) {
        return new Set(values);
    }
    return values;
}
/**
 * Generate a UUID (Universally Unique Identifier) in version 4. A version 4
 * UUID is randomly generated. This is a small wrapper around `uuid.v4()`
 *
 * @returns An UUID version 4
 */
export function genUuid() {
    return uuidv4();
}
/**
 * @param duration - in seconds
 *
 * @return `01:23`
 */
export function formatDuration(duration, short = false) {
    duration = Number(duration);
    let from = 11;
    let length = 8;
    if (duration < 3600 && short) {
        from = 14;
        length = 5;
    }
    return new Date(Number(duration) * 1000).toISOString().substr(from, length);
}
/**
 * Get the current school year. The function returns year in which the school year begins.
 *
 * @returns The year in which the school year begins, for example `2021/22`: `2021`
 */
export function getCurrentSchoolYear() {
    const date = new Date();
    // getMonth: 0 = January
    // 8 = September
    if (date.getMonth() < 8) {
        return date.getFullYear() - 1;
    }
    return date.getFullYear();
}
/**
 *
 * @returns e. g. `2021/22`
 */
export function getFormatedSchoolYear() {
    const year = getCurrentSchoolYear();
    const endYear = year + 1;
    const endYearString = endYear.toString().substr(2);
    return `${year.toString()}/${endYearString}`;
}
