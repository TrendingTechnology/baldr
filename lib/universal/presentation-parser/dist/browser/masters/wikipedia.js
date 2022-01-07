var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getHttp } from '@bldr/media-resolver';
/**
 * @param language - A Wikipedia language code (for example `de`, `en`)
 */
function queryWiki(language, params) {
    return __awaiter(this, void 0, void 0, function* () {
        if (params.origin == null) {
            params.origin = '*';
        }
        if (params.format == null) {
            params.format = 'json';
        }
        const response = yield getHttp(`https://${language}.wikipedia.org/w/api.php`, { params });
        if (response.status === 200) {
            return response.data;
        }
        throw new Error('Axios error: {response.status}');
    });
}
/**
 * Used to store the body text and the preview image url.
 */
export function formatWikipediaId(title, language, oldid) {
    let wikipediaId = `${language}:${title}`;
    if (oldid != null) {
        wikipediaId += ':' + oldid.toString();
    }
    return wikipediaId;
}
export function formatTitleHumanReadable(title) {
    return title.replace(/_/g, ' ');
}
export function formatTitleForLink(fields) {
    let oldid = '';
    if (fields.oldid) {
        oldid = ` (Version ${fields.oldid})`;
    }
    const title = fields.title.replace(/ /g, '_');
    return `${fields.language}:${title}${oldid}`;
}
export function formatUrl(fields) {
    let oldid = '';
    if (fields.oldid != null) {
        oldid = `&oldid=${fields.oldid}`;
    }
    const title = fields.title.replace(/ /g, '_');
    return `https://${fields.language}.wikipedia.org/w/index.php?title=${title}&redirect=no${oldid}`;
}
/**
 * A little cache save some http calls.
 */
const thumbnailUrls = {};
const bodies = {};
export const cache = {
    bodies,
    thumbnailUrls
};
/**
 * @param title - The title of a Wikipedia page (for example
 *   `Wolfgang Amadeus Mozart` or `Ludwig_van_Beethoven`).
 * @param language - A Wikipedia language code (for example `de`, `en`)
 *   {@link https://en.wikipedia.org/wiki/List_of_Wikipedias}.
 *
 * @see {@link https://www.mediawiki.org/wiki/Extension:PageImages}
 */
export function queryFirstImage(title, language = DEFAULT_LANGUAGE) {
    return __awaiter(this, void 0, void 0, function* () {
        const wikipediaId = formatWikipediaId(title, language);
        if (cache.thumbnailUrls[wikipediaId] != null) {
            return cache.thumbnailUrls[wikipediaId];
        }
        const response = yield queryWiki(language, {
            action: 'query',
            titles: title,
            prop: 'pageimages',
            pithumbsize: 500
        });
        // {
        //   "batchcomplete": "",
        //   "query": {
        //     "normalized": [
        //       {
        //         "from": "Franz_Seraph_Reicheneder",
        //         "to": "Franz Seraph Reicheneder"
        //       }
        //     ],
        //     "pages": {
        //       "746159": {
        //         "pageid": 746159,
        //         "ns": 0,
        //         "title": "Franz Seraph Reicheneder",
        //         "thumbnail": {
        //           "source": "https://upload.wikimedia.org/wikipedia/de/thumb/b/be/Fr.jpg",
        //           "width": 355,
        //           "height": 500
        //         },
        //         "pageimage": "Franz_Seraph_Reicheneder_(Porträt).jpg"
        //       }
        //     }
        //   }
        // }
        for (const pageId in response.query.pages) {
            const page = response.query.pages[pageId];
            if (page.thumbnail != null) {
                const url = page.thumbnail.source;
                cache.thumbnailUrls[wikipediaId] = url;
                return url;
            }
        }
    });
}
export function getFirstImage(wikipediaId) {
    if (cache.thumbnailUrls[wikipediaId] != null) {
        return cache.thumbnailUrls[wikipediaId];
    }
    throw new Error(`No cached wikipedia preview image URL found for ${wikipediaId}`);
}
/**
 * @param title - The title of a Wikipedia page (for example
 *   `Wolfgang Amadeus Mozart` or `Ludwig_van_Beethoven`).
 * @param language - A Wikipedia language code (for example `de`, `en`)
 *   {@link https://en.wikipedia.org/wiki/List_of_Wikipedias}.
 *
 * @see {@link https://www.mediawiki.org/wiki/API:Get_the_contents_of_a_page}
 * @see {@link https://www.mediawiki.org/wiki/API:Parsing_wikitext}
 */
export function queryHtmlBody(title, language, oldid) {
    return __awaiter(this, void 0, void 0, function* () {
        const wikipediaId = formatWikipediaId(title, language, oldid);
        if (cache.bodies[wikipediaId] != null) {
            return cache.bodies[wikipediaId];
        }
        const params = {
            action: 'parse',
            page: title,
            prop: 'text',
            disablelimitreport: true,
            disableeditsection: true,
            disabletoc: true
        };
        if (oldid != null) {
            params.oldid = oldid;
            delete params.page;
        }
        const response = yield queryWiki(language, params);
        if (response.parse != null) {
            let body = response.parse.text['*'];
            // Fix links
            body = body
                .replace(/href="\/wiki\//g, `href="https://${language}.wikipedia.org/wiki/`)
                .replace(/src="\/\/upload.wikimedia.org/g, 'src="https://upload.wikimedia.org');
            cache.bodies[wikipediaId] = body;
            return body;
        }
    });
}
export function getHtmlBody(title, language, oldid) {
    const wikipediaId = formatWikipediaId(title, language, oldid);
    if (cache.bodies[wikipediaId] != null) {
        return cache.bodies[wikipediaId];
    }
    throw new Error(`No cached wikipedia HTML body found for ${language}:${title}`);
}
const DEFAULT_LANGUAGE = 'de';
export class WikipediaMaster {
    constructor() {
        this.name = 'wikipedia';
        this.displayName = 'Wikipedia';
        this.icon = {
            name: 'wikipedia',
            color: 'black',
            /**
             * U+26AA
             *
             * @see https://emojipedia.org/white-circle/
             */
            unicodeSymbol: '⚪'
        };
        this.fieldsDefintion = {
            title: {
                type: String,
                required: true,
                description: 'Der Titel des Wikipedia-Artikels (z. B. „Ludwig_van_Beethoven“).'
            },
            language: {
                type: String,
                description: 'Der Sprachen-Code des gewünschten Wikipedia-Artikels (z. B. „de“, „en“).',
                default: DEFAULT_LANGUAGE
            },
            oldid: {
                type: Number,
                description: 'Eine alte Version verwenden.'
            }
        };
    }
    normalizeFieldsInput(fields) {
        if (typeof fields === 'string') {
            // de:Wolfgang_Amadeus_Mozart
            const regExp = new RegExp(/^([a-z]+):(.+)$/);
            const match = fields.match(regExp);
            if (match != null) {
                fields = {
                    title: match[2],
                    language: match[1]
                };
            }
            else {
                // Wolfgang_Amadeus_Mozart
                fields = { title: fields, language: DEFAULT_LANGUAGE };
            }
        }
        return fields;
    }
}
