import { MasterSpec } from '../master-specification'

import { getHttp } from '@bldr/media-resolver-ng'

interface UrlParameterCollection {
  /**
   * `action=parse`
   */
  action?: string

  /**
   * https://www.mediawiki.org/wiki/API:Cross-site_requests The
   * MediaWiki API requires that the origin be supplied as a query
   * string parameter, with the value being the site from which
   * the request originates, which is matched against the Origin
   * header required by the CORS protocol. Note that this
   * parameter must be included in any pre-flight request, and so
   * should be included in the query string portion of the request
   * URI even for POST requests.
   */
  origin?: string

  /**
   * `json`
   */
  format?: string

  /**
   * Parse the content of this page. Cannot be used together with text and title.
   */
  page?: string

  /**
   * Parse the content of this revision. Overrides page and pageid.
   */
  oldid?: number

  /**
   * Which pieces of information to get.
   */
  prop?: string

  /**
   * Omit the limit report ("NewPP limit report") from the parser output.
   */
  disablelimitreport?: true

  /**
   * Omit edit section links from the parser output.
   */
  disableeditsection?: boolean

  /**
   * Omit table of contents in output.
   */
  disabletoc?: boolean
  [prop: string]: any
}

/**
 * @param language - A Wikipedia language code (for example `de`, `en`)
 */
async function queryWiki (
  language: string,
  params: UrlParameterCollection
): Promise<any> {
  if (params.origin == null) {
    params.origin = '*'
  }
  if (params.format == null) {
    params.format = 'json'
  }
  const response = await getHttp(
    `https://${language}.wikipedia.org/w/api.php`,
    { params }
  )
  if (response.status === 200) {
    return response.data
  }
  throw new Error('Axios error: {response.status}')
}

/**
 * Used to store the body text and the preview image url.
 */
export function formatWikipediaId (
  title: string,
  language: string,
  oldid?: number
): string {
  let wikipediaId = `${language}:${title}`
  if (oldid != null) {
    wikipediaId += ':' + oldid.toString()
  }
  return wikipediaId
}

export function formatTitleHumanReadable (title: string): string {
  return title.replace(/_/g, ' ')
}

export function formatTitleForLink (fields: WikipediaFieldsNormalized): string {
  let oldid = ''
  if (fields.oldid) {
    oldid = ` (Version ${fields.oldid})`
  }
  const title = fields.title.replace(/ /g, '_')
  return `${fields.language}:${title}${oldid}`
}

export function formatUrl (fields: WikipediaFieldsNormalized): string {
  let oldid = ''
  if (fields.oldid != null) {
    oldid = `&oldid=${fields.oldid}`
  }
  const title = fields.title.replace(/ /g, '_')
  return `https://${fields.language}.wikipedia.org/w/index.php?title=${title}&redirect=no${oldid}`
}

/**
 * A little cache save some http calls.
 */
const thumbnailUrls: {
  [id: string]: string
} = {}

const bodies: {
  [id: string]: string
} = {}

export const cache = {
  bodies,
  thumbnailUrls
}

/**
 * @param title - The title of a Wikipedia page (for example
 *   `Wolfgang Amadeus Mozart` or `Ludwig_van_Beethoven`).
 * @param language - A Wikipedia language code (for example `de`, `en`)
 *   {@link https://en.wikipedia.org/wiki/List_of_Wikipedias}.
 *
 * @see {@link https://www.mediawiki.org/wiki/Extension:PageImages}
 */
export async function queryFirstImage (
  title: string,
  language: string = DEFAULT_LANGUAGE
): Promise<string | undefined> {
  const wikipediaId = formatWikipediaId(title, language)
  if (cache.thumbnailUrls[wikipediaId] != null) {
    return cache.thumbnailUrls[wikipediaId]
  }
  const response = await queryWiki(language, {
    action: 'query',
    titles: title,
    prop: 'pageimages',
    pithumbsize: 500
  })
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
    const page = response.query.pages[pageId]
    if (page.thumbnail != null) {
      const url = page.thumbnail.source
      cache.thumbnailUrls[wikipediaId] = url
      return url
    }
  }
}

export function getFirstImage (wikipediaId: string): string {
  if (cache.thumbnailUrls[wikipediaId] != null) {
    return cache.thumbnailUrls[wikipediaId]
  }
  throw new Error(
    `No cached wikipedia preview image URL found for ${wikipediaId}`
  )
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
export async function queryHtmlBody (
  title: string,
  language: string,
  oldid?: number
): Promise<string | undefined> {
  const wikipediaId = formatWikipediaId(title, language, oldid)
  if (cache.bodies[wikipediaId] != null) {
    return cache.bodies[wikipediaId]
  }
  const params: UrlParameterCollection = {
    action: 'parse',
    page: title,
    prop: 'text',
    disablelimitreport: true,
    disableeditsection: true,
    disabletoc: true
  }

  if (oldid != null) {
    params.oldid = oldid
    delete params.page
  }
  const response = await queryWiki(language, params)
  if (response.parse != null) {
    let body = response.parse.text['*']
    // Fix links
    body = body
      .replace(
        /href="\/wiki\//g,
        `href="https://${language}.wikipedia.org/wiki/`
      )
      .replace(
        /src="\/\/upload.wikimedia.org/g,
        'src="https://upload.wikimedia.org'
      )

    cache.bodies[wikipediaId] = body
    return body
  }
}

export function getHtmlBody (
  title: string,
  language: string,
  oldid?: number
): string {
  const wikipediaId = formatWikipediaId(title, language, oldid)
  if (cache.bodies[wikipediaId] != null) {
    return cache.bodies[wikipediaId]
  }
  throw new Error(
    `No cached wikipedia HTML body found for ${language}:${title}`
  )
}

const DEFAULT_LANGUAGE = 'de'

type WikipediaFieldsRaw = string | WikipediaFieldsNormalized

export interface WikipediaFieldsNormalized {
  title: string
  language: string
  oldid?: number
}

export class WikipediaMaster implements MasterSpec {
  name = 'wikipedia'

  displayName = 'Wikipedia'

  icon = {
    name: 'wikipedia',
    color: 'black',

    /**
     * U+26AA
     *
     * @see https://emojipedia.org/white-circle/
     */
    unicodeSymbol: '⚪'
  }

  fieldsDefintion = {
    title: {
      type: String,
      required: true,
      description:
        'Der Titel des Wikipedia-Artikels (z. B. „Ludwig_van_Beethoven“).'
    },
    language: {
      type: String,
      description:
        'Der Sprachen-Code des gewünschten Wikipedia-Artikels (z. B. „de“, „en“).',
      default: DEFAULT_LANGUAGE
    },
    oldid: {
      type: Number,
      description: 'Eine alte Version verwenden.'
    }
  }

  normalizeFieldsInput (fields: WikipediaFieldsRaw): WikipediaFieldsNormalized {
    if (typeof fields === 'string') {
      // de:Wolfgang_Amadeus_Mozart
      const regExp = new RegExp(/^([a-z]+):(.+)$/)
      const match = fields.match(regExp)
      if (match != null) {
        fields = {
          title: match[2],
          language: match[1]
        }
      } else {
        // Wolfgang_Amadeus_Mozart
        fields = { title: fields, language: DEFAULT_LANGUAGE }
      }
    }
    return fields
  }
}
