"use strict";
/**
 * @module @bldr/wikidata
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = exports.mergeData = exports.fetchCommonsFile = void 0;
const fs = require("fs");
const childProcess = require("child_process");
const node_fetch_1 = require("node-fetch");
const wikibaseSdk = require("wikibase-sdk");
// Project packages.
const core_node_1 = require("@bldr/core-node");
const wikibase = wikibaseSdk({
    instance: 'https://www.wikidata.org',
    sparqlEndpoint: 'https://query.wikidata.org/sparql'
});
/**
 * ```js
 * let entity = {
 *   ref: 'Q202698',
 *   type: 'item',
 *   modified: '2020-03-20T20:27:33Z',
 *   labels: { de: 'Yesterday', en: 'Yesterday' },
 *   descriptions: {
 *     en: 'original song written and composed by Lennon-McCartney',
 *     de: 'Lied von The Beatles'
 *   },
 *   aliases: {},
 *   claims: {
 *     P175: [ 'Q1299' ],
 *     P31: [ 'Q207628', 'Q7366' ],
 *     P435: [ '0c80db24-389e-3620-8e0b-84dc2b7c009a' ],
 *     P646: [ '/m/01227d' ]
 *   },
 *   sitelinks: {
 *     arwiki: 'يسترداي',
 *     cawiki: 'Yesterday',
 *     cswiki: 'Yesterday (píseň)',
 *     dawiki: 'Yesterday',
 *     dewiki: 'Yesterday',
 *     elwiki: 'Yesterday (τραγούδι, The Beatles)',
 *     enwiki: 'Yesterday (Beatles song)'
 *   }
 * }
 * ```
 */
let entity;
/**
 * If the array has only one item, return only this item, else return
 * the original array.
 *
 * @param values
 * @param onlyOne - Return only the first item of an array if there
 *   more
 * @param throwError - If there are more than values in an array.
 */
function unpackArray(values, onlyOne, throwError) {
    if (values == null)
        return '';
    if (Array.isArray(values)) {
        if (values.length === 1) {
            return values[0];
        }
        else if (throwError != null && throwError) {
            throw new Error(`Array has more than one item: ${values.toString()}`);
        }
    }
    if (Array.isArray(values) &&
        values.length > 1 &&
        onlyOne != null &&
        onlyOne) {
        return values[0];
    }
    return values;
}
/**
 * Return the first element of a string array.
 *
 * @param values
 */
function pickFirst(values) {
    return unpackArray(values, true, false);
}
/**
 * @param props - for example `['labels']`
 */
function getEntities(itemIds, props) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = wikibase.getEntities(itemIds, ['en', 'de'], props);
        const response = yield (0, node_fetch_1.default)(url);
        const json = yield response.json();
        const entities = yield wikibase.parse.wd.entities(json);
        if (Array.isArray(itemIds))
            return entities;
        return entities[itemIds];
    });
}
function fetchResizeFile(url, dest) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, core_node_1.fetchFile)(url, dest);
        if (fs.existsSync(dest)) {
            const stat = fs.statSync(dest);
            if (stat.size > 500000) {
                const process = childProcess.spawnSync('magick', [
                    'convert',
                    dest,
                    '-resize',
                    '2000x2000>',
                    '-quality',
                    '60',
                    dest
                ]);
                if (process.status !== 0) {
                    throw new Error(`Error resizing image ${dest}`);
                }
            }
        }
    });
}
/**
 * Download a file from wiki commonds.
 *
 * @param fileName - The file name from wiki commonds.
 * @param dest - A file path where to store the file locally.
 */
function fetchCommonsFile(fileName, dest) {
    return __awaiter(this, void 0, void 0, function* () {
        // wikicommons:George-W-Bush.jpeg
        fileName = fileName.replace('wikicommons:', '');
        const url = wikibase.getImageUrl(fileName);
        return yield fetchResizeFile(url, dest);
    });
}
exports.fetchCommonsFile = fetchCommonsFile;
/**
 * Get data from one claim. Try multiple claims to get the first existing
 * claim.
 */
function getClaim(entity, claims) {
    function getSingleClaim(entity, claim) {
        if (entity.claims[claim] != null) {
            const typeData = entity.claims[claim];
            return unpackArray(typeData);
        }
    }
    if (Array.isArray(claims)) {
        for (const claim of claims) {
            const typeData = getSingleClaim(entity, claim);
            if (typeData != null)
                return typeData;
        }
    }
    else {
        return getSingleClaim(entity, claims);
    }
}
/**
 * A collection of functions
 */
const functions = {
    /*******************************************************************************
     * get from entity
     ******************************************************************************/
    /**
     * ```js
     * const entity = {
     *   id: 'Q1299',
     *   type: 'item',
     *   modified: '2020-03-15T20:18:33Z',
     *   descriptions: { en: 'English pop-rock band', de: 'Rockband aus Liverpool' }
     * }
     * ```
     */
    getDescription: function (entity) {
        const desc = entity.descriptions;
        if (desc.de != null) {
            return desc.de;
        }
        else if (desc.en != null) {
            return desc.en;
        }
        return '';
    },
    /**
     * ```js
     * const entity = {
     *   id: 'Q312609',
     *   type: 'item',
     *   modified: '2020-03-01T19:08:47Z',
     *   labels: { de: 'Cheb Khaled', en: 'Khaled' },
     * }
     * ```
     *
     * @param {Object} entity
     *
     * @returns {Array|String}
     */
    getLabel: function (entity) {
        if (entity.labels.de != null) {
            return entity.labels.de;
        }
        else {
            return entity.labels.en;
        }
    },
    /**
     * ```js
     * entity = {
     *   sitelinks: {
     *     afwiki: 'The Beatles',
     *     akwiki: 'The Beatles',
     *   }
     * }
     * ```
     */
    getWikipediaTitle: function (entity) {
        const sitelinks = entity.sitelinks;
        const keys = Object.keys(sitelinks);
        if (keys.length === 0)
            return '';
        let key;
        if (sitelinks.dewiki != null) {
            key = 'dewiki';
        }
        else if (sitelinks.enwiki != null) {
            key = 'enwiki';
        }
        else {
            key = keys.shift();
        }
        if (key == null)
            return '';
        // https://de.wikipedia.org/wiki/Ludwig_van_Beethoven
        const siteLink = wikibase.getSitelinkUrl({
            site: key,
            title: sitelinks[key]
        });
        if (siteLink == null)
            return '';
        // {
        //   lang: 'de',
        //   project: 'wikipedia',
        //   key: 'dewiki',
        //   title: 'Ludwig_van_Beethoven',
        //   url: 'https://de.wikipedia.org/wiki/Ludwig_van_Beethoven'
        // }
        const linkData = wikibase.getSitelinkData(siteLink);
        return `${linkData.lang}:${linkData.title}`;
    },
    /*******************************************************************************
     * second query
     ******************************************************************************/
    /**
     * Query the wikidata API for the given items and return only the label.
     *
     * @param itemIds - for example `['Q123', 'Q234']`
     */
    queryLabels: function (itemIds) {
        return __awaiter(this, void 0, void 0, function* () {
            itemIds = unpackArray(itemIds);
            const entities = yield getEntities(itemIds, ['labels']);
            if (entities.id != null) {
                const entity = entities;
                return functions.getLabel(entity);
            }
            const result = [];
            for (const itemId in entities) {
                const entity = entities[itemId];
                result.push(functions.getLabel(entity));
            }
            return result;
        });
    },
    /*******************************************************************************
     * format
     ******************************************************************************/
    /**
     * @param date - for example `[ '1770-12-16T00:00:00.000Z' ]`
     */
    formatDate: function (date) {
        // Frederic Chopin has two birth dates.
        // throw no error
        date = pickFirst(date);
        if (date == null)
            return '';
        return date.replace(/T.+$/, '');
    },
    formatList: function (list) {
        if (Array.isArray(list)) {
            return list.join(', ');
        }
        return list;
    },
    /**
     * Extract the 4 digit year from a date string
     *
     * @param dateSpec - For example `1968-01-01`
     *
     * @returns for example `1968`
     */
    formatYear: function (dateSpec) {
        // Janis Joplin Cry Baby has two dates as an array.
        const value = pickFirst(dateSpec);
        return value.substr(0, 4);
    },
    /**
     * Replace all white spaces with an underscore and prefix “wikicommons:”.
     */
    formatWikicommons: function (value) {
        value = pickFirst(value);
        value = value.replace(/ /g, '_');
        return `wikicommons:${value}`;
    },
    /**
     * Only return one value, not an array of values.
     */
    formatSingleValue: function (value) {
        if (Array.isArray(value))
            return value[0];
        return value;
    }
};
/**
 * Merge two objects containing metadata: a original metadata object and a
 * object obtained from wikidata. Override a property in original only if
 * `alwaysUpdate` is set on the property specification.
 */
function mergeData(data, dataWiki, categoryCollection) {
    var _a;
    // Ẃe delete properties from this object -> make a flat copy.
    const dataOrig = Object.assign({}, data);
    if (dataOrig.categories == null) {
        return Object.assign({}, dataOrig, dataWiki);
    }
    const typeData = {};
    for (const typeName of dataOrig.categories.split(',')) {
        const propSpecs = categoryCollection[typeName].props;
        for (const propName in dataWiki) {
            if (((_a = propSpecs === null || propSpecs === void 0 ? void 0 : propSpecs[propName]) === null || _a === void 0 ? void 0 : _a.wikidata) != null) {
                const propSpec = propSpecs[propName].wikidata;
                if (propSpec != null &&
                    typeof propSpec !== 'boolean' &&
                    ((dataOrig[propName] != null && propSpec.alwaysUpdate != null) ||
                        dataOrig[propName] == null)) {
                    typeData[propName] = dataWiki[propName];
                    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                    delete dataOrig[propName];
                }
                else {
                    typeData[propName] = dataWiki[propName];
                }
            }
        }
    }
    for (const propName in dataOrig) {
        typeData[propName] = dataOrig[propName];
    }
    return typeData;
}
exports.mergeData = mergeData;
/**
 * Query wikidata.
 *
 * @param itemId - for example `Q123`
 */
function query(itemId, typeNames, categoryCollection) {
    return __awaiter(this, void 0, void 0, function* () {
        if (wikibase.isItemId(itemId) == null) {
            throw new Error(`No item ref: ${itemId}`);
        }
        entity = (yield getEntities(itemId));
        if (!typeNames.includes('general'))
            typeNames = `general,${typeNames}`;
        // eslint-disable-next-line
        const data = {};
        data.wikidata = itemId;
        for (const typeName of typeNames.split(',')) {
            if (categoryCollection[typeName] == null) {
                throw new Error(`Unkown type name: “${typeName}”`);
            }
            const typeSpec = categoryCollection[typeName];
            for (const propName in typeSpec.props) {
                if (typeSpec.props[propName].wikidata != null) {
                    const propSpec = typeSpec.props[propName]
                        .wikidata;
                    let value;
                    // source
                    if (propSpec.fromClaim == null && propSpec.fromEntity == null) {
                        throw new Error(`Spec must have a source property (“fromClaim” or “fromEntity”): ${JSON.stringify(propSpec)}`);
                    }
                    if (propSpec.fromClaim != null) {
                        value = getClaim(entity, propSpec.fromClaim);
                    }
                    if (value == null && propSpec.fromEntity != null) {
                        const func = functions[propSpec.fromEntity];
                        if (typeof func !== 'function') {
                            throw new Error(`Unkown from entity source “${propSpec.fromEntity}”`);
                        }
                        value = func(entity);
                    }
                    // second query
                    if (value != null && propSpec.secondQuery != null) {
                        value = yield functions[propSpec.secondQuery](value);
                    }
                    // format
                    if (value != null && propSpec.format != null) {
                        if (typeof propSpec.format === 'function') {
                            value = propSpec.format(value, typeSpec);
                        }
                        else {
                            const func = functions[propSpec.format];
                            if (typeof func !== 'function') {
                                let formatFunctions = Object.keys(functions);
                                formatFunctions = formatFunctions.filter(value => value.match(/^format.*/));
                                throw new Error(`Unkown format function “${propSpec.format}”. Use one of: ${formatFunctions.join()}`);
                            }
                            value = func(value);
                        }
                    }
                    if (value != null)
                        data[propName] = value;
                }
            }
            if (typeof typeSpec.normalizeWikidata === 'function') {
                typeSpec.normalizeWikidata({ data, entity, functions });
            }
        }
        return data;
    });
}
exports.query = query;
