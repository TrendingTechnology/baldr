var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from 'axios';
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
        const response = yield axios.get(`https://${language}.wikipedia.org/w/api.php`, { params });
        if (response.status === 200) {
            return response.data;
        }
        throw new Error('Axios error: {response.status}');
    });
}
/**
 * @param title - The title of a Wikipedia page (for example
 *   `Wolfgang Amadeus Mozart` or `Ludwig_van_Beethoven`).
 * @param language - A Wikipedia language code (for example `de`, `en`)
 *   {@link https://en.wikipedia.org/wiki/List_of_Wikipedias}.
 *
 * @see {@link https://www.mediawiki.org/wiki/Extension:PageImages}
 */
export function getFirstImage(title, language = 'de') {
    return __awaiter(this, void 0, void 0, function* () {
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
                return page.thumbnail.source;
            }
        }
    });
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
export function getHtmlBody(title, language, oldid) {
    return __awaiter(this, void 0, void 0, function* () {
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
            const body = response.parse.text['*'];
            // Fix links
            return body
                .replace(/href="\/wiki\//g, `href="https://${language}.wikipedia.org/wiki/`)
                .replace(/src="\/\/upload.wikimedia.org/g, 'src="https://upload.wikimedia.org');
        }
    });
}
/**
 * Used for the Vuex store as a key.
 */
export function formatId(language, title) {
    return `${language}:${title}`;
}
export function formatUrl(props) {
    let oldid = '';
    if (props.oldid != null) {
        oldid = `&oldid=${props.oldid}`;
    }
    const title = props.title.replace(/ /g, '_');
    return `https://${props.language}.wikipedia.org/w/index.php?title=${title}&redirect=no${oldid}`;
}
