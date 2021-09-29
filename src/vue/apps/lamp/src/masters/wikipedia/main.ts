/**
 * `id`: `language:title` for example `de:Wolfgang_Amadeus_Mozart`
 *
 * @module @bldr/lamp/masters/wikipedia
 */

import { validateMasterSpec } from '@bldr/lamp-core'

import axios from 'axios'
import Vue from 'vue'

const defaultLanguage = 'de'

interface AxiosParams {
  origin?: string
  format?: string
  action?: string
  [prop: string]: any
}

/**
 * @param language - A Wikipedia language code (for example `de`, `en`)
 * @param {Object} params
 */
async function queryWiki (language: string, params: AxiosParams) {
  if (!params.origin) {
    // https://www.mediawiki.org/wiki/API:Cross-site_requests The
    // MediaWiki API requires that the origin be supplied as a query
    // string parameter, with the value being the site from which
    // the request originates, which is matched against the Origin
    // header required by the CORS protocol. Note that this
    // parameter must be included in any pre-flight request, and so
    // should be included in the query string portion of the request
    // URI even for POST requests.
    params.origin = '*'
  }
  if (!params.format) {
    params.format = 'json'
  }
  const response = await axios.get(
    `https://${language}.wikipedia.org/w/api.php`,
    { params }
  )
  if (response.status === 200) {
    return response.data
  }
  throw new Error(`Axios error: {response.status}`)
}

/**
 * @param title - The title of a Wikipedia page (for example
 *   `Wolfgang Amadeus Mozart` or `Ludwig_van_Beethoven`).
 * @param language - A Wikipedia language code (for example `de`, `en`)
 *   {@link https://en.wikipedia.org/wiki/List_of_Wikipedias}.
 *
 * @see {@link https://www.mediawiki.org/wiki/Extension:PageImages}
 */
export async function getFirstImage (title: string, language: string = 'de') {
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
    if (page.thumbnail) return page.thumbnail.source
  }
}

/**
 * @param {String} title - The title of a Wikipedia page (for example
 *   `Wolfgang Amadeus Mozart` or `Ludwig_van_Beethoven`).
 * @param {String} language - A Wikipedia language code (for example `de`, `en`)
 *   {@link https://en.wikipedia.org/wiki/List_of_Wikipedias}.
 *
 * @see {@link https://www.mediawiki.org/wiki/API:Get_the_contents_of_a_page}
 * @see {@link https://www.mediawiki.org/wiki/API:Parsing_wikitext}
 */
export async function getHtmlBody (
  title: string,
  language: string = 'de',
  oldid: string
) {
  const params: AxiosParams = {
    action: 'parse',
    page: title,
    prop: 'text',
    disablelimitreport: true, // disablelimitreport
    disableeditsection: true, // Omit edit section links from the parser output.
    disabletoc: true // Omit table of contents in output.
  }

  if (oldid) {
    params.oldid = oldid
    delete params.page
  }
  const response = await queryWiki(language, params)
  if (response.parse) {
    const body = response.parse.text['*']
    // Fix links
    return body.replace(
      /href="\/wiki\//g,
      `href="https://${language}.wikipedia.org/wiki/`
    )
  }
}

/**
 * Used for the Vuex store as a key.
 *
 * @param language
 * @param title
 */
export function formatId (language: string, title: string) {
  return `${language}:${title}`
}

function formatUrl (props: any): string {
  let oldid = ''
  if (props.oldid) {
    oldid = `&oldid=${props.oldid}`
  }
  const title = props.title.replace(/ /g, '_')
  return `https://${props.language}.wikipedia.org/w/index.php?title=${title}&redirect=no${oldid}`
}

interface State {
  thumbnailUrls: {
    [id: string]: string
  }
  bodies: {
    [id: string]: string
  }
}

const state: State = {
  thumbnailUrls: {},
  bodies: {}
}

const getters = {
  bodyById: (state: State) => (id: string) => {
    if (state.bodies[id]) {
      return state.bodies[id]
    }
  },
  thumbnailUrlById: (state: State) => (id: string) => {
    if (state.thumbnailUrls[id]) {
      return state.thumbnailUrls[id]
    }
  }
}

const mutations = {
  addBody (state: State, { id, body }: any) {
    Vue.set(state.bodies, id, body)
  },
  addThumbnailUrl (state: State, { id, thumbnailUrl }: any) {
    Vue.set(state.thumbnailUrls, id, thumbnailUrl)
  }
}

export default validateMasterSpec({
  name: 'wikipedia',
  title: 'Wikipedia',
  propsDef: {
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
      default: defaultLanguage
    },
    oldid: {
      type: Number,
      description: 'Eine alte Version verwenden.'
    }
  },
  icon: {
    name: 'wikipedia',
    color: 'black'
  },
  styleConfig: {
    centerVertically: true,
    darkMode: false
  },
  store: {
    state,
    getters,
    mutations
  },
  hooks: {
    normalizeProps (props) {
      if (typeof props === 'string') {
        // de:Wolfgang_Amadeus_Mozart
        const regExp = new RegExp(/^([a-z]+):(.+)$/)
        const match = props.match(regExp)
        if (match) {
          props = {
            title: match[2],
            language: match[1]
          }
        } else {
          // Wolfgang_Amadeus_Mozart
          props = { title: props }
        }
      }
      if (!props.language) props.language = defaultLanguage
      return props
    },
    async afterLoading ({ props, master }) {
      const id = formatId(props.language, props.title)
      const body = await getHtmlBody(props.title, props.language, props.oldid)
      if (body) {
        master.$commit('addBody', { id, body })
      }
      const thumbnailUrl = await getFirstImage(props.title, props.language)
      if (thumbnailUrl) {
        master.$commit('addThumbnailUrl', { id, thumbnailUrl })
      }
    },
    collectPropsMain (props) {
      return {
        title: props.title,
        language: props.language,
        id: formatId(props.language, props.title),
        oldid: props.oldid,
        httpUrl: formatUrl(props)
      }
    },
    collectPropsPreview ({ propsMain }) {
      return {
        title: propsMain.title,
        id: propsMain.id
      }
    },
    plainTextFromProps (props) {
      return `${props.title} (${props.language})`
    }
  }
})
