const defaultLanguage = 'de'

import axios from 'axios'

export async function getFirstImage (title, language = 'de') {

}

export async function getHtmlBody(title, language = 'de') {
  // https://www.mediawiki.org/wiki/API:Parsing_wikitext
  // https://en.wikipedia.org/w/api.php?action=parse&page=Pet_door&prop=text&formatversion=2&format=json
  const response = await axios.get(`https://${language}.wikipedia.org/w/api.php`, {
    params: {
      action: 'parse',
      page: title,
      prop: 'text',
      format: 'json',
      // https://www.mediawiki.org/wiki/API:Cross-site_requests The
      // MediaWiki API requires that the origin be supplied as a query
      // string parameter, with the value being the site from which
      // the request originates, which is matched against the Origin
      // header required by the CORS protocol. Note that this
      // parameter must be included in any pre-flight request, and so
      // should be included in the query string portion of the request
      // URI even for POST requests.
      origin: '*',
      disablelimitreport: true, // disablelimitreport
      disableeditsection: true, // Omit edit section links from the parser output.
      disabletoc: true // Omit table of contents in output.
    }
  })
  if (response.status === 200) {
    return response.data.parse.text['*']
  }
}

// https://www.mediawiki.org/wiki/API:Get_the_contents_of_a_page

export default {
  title: 'Wikipedia',

  props: {
    title: {
      type: String,
      required: true,
      description: 'Der Titel des Wikipedia-Artikels (z. B. „Ludwig_van_Beethoven“).'
    },
    language: {
      type: String,
      description: 'Der Sprachen-Code des gewünschten Wikipedia-Artikels (z. B. „de“, „en“).',
      default: defaultLanguage
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
  hooks: {
    normalizeProps(props) {
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
    collectPropsMain(props) {
      return {
        title: props.title,
        language: props.language,
        httpUrl: `https://${props.language}.wikipedia.org/wiki/${props.title}`,
        iframeHttpUrl: `https://${props.language}.wikipedia.org/w/index.php?title=${props.title}&printable=yes`
      }
    },
    collectPropsPreview({ propsMain }) {
      return {
        title: propsMain.title
      }
    },
    plainTextFromProps(props) {
      return `${props.title} (${props.language})`
    }
  }
}
