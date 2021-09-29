import axios from 'axios'

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

interface MasterProps {
  language: string
  title: string
  oldid?: number
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
  const response = await axios.get(
    `https://${language}.wikipedia.org/w/api.php`,
    { params }
  )
  if (response.status === 200) {
    return response.data
  }
  throw new Error('Axios error: {response.status}')
}

/**
 * @param title - The title of a Wikipedia page (for example
 *   `Wolfgang Amadeus Mozart` or `Ludwig_van_Beethoven`).
 * @param language - A Wikipedia language code (for example `de`, `en`)
 *   {@link https://en.wikipedia.org/wiki/List_of_Wikipedias}.
 *
 * @see {@link https://www.mediawiki.org/wiki/Extension:PageImages}
 */
export async function getFirstImage (
  title: string,
  language: string = 'de'
): Promise<string | undefined> {
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
      return page.thumbnail.source
    }
  }
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
export async function getHtmlBody (
  title: string,
  language: string,
  oldid?: number
): Promise<string | undefined> {
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
    const body = response.parse.text['*']
    // Fix links
    return body
      .replace(
        /href="\/wiki\//g,
        `href="https://${language}.wikipedia.org/wiki/`
      )
      .replace(
        /src="\/\/upload.wikimedia.org/g,
        'src="https://upload.wikimedia.org'
      )
  }
}

/**
 * Used for the Vuex store as a key.
 */
export function formatId (language: string, title: string): string {
  return `${language}:${title}`
}

export function formatUrl (props: MasterProps): string {
  let oldid = ''
  if (props.oldid != null) {
    oldid = `&oldid=${props.oldid}`
  }
  const title = props.title.replace(/ /g, '_')
  return `https://${props.language}.wikipedia.org/w/index.php?title=${title}&redirect=no${oldid}`
}
