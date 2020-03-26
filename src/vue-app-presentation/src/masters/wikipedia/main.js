const defaultLanguage = 'de'

// https://www.mediawiki.org/wiki/API:Get_the_contents_of_a_page
// https://www.mediawiki.org/wiki/API:Parsing_wikitext
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
  normalizeProps (props) {
    if (typeof props === 'string') {
      props = { title: props }
    }
    if (!props.language) props.language = defaultLanguage
    return props
  },
  collectPropsMain (props) {
    return {
      title: props.title,
      language: props.language,
      httpUrl: `https://${props.language}.wikipedia.org/wiki/${props.title}`,
      iframeHttpUrl: `https://${props.language}.wikipedia.org/w/index.php?title=${props.title}&printable=yes`
    }
  },
  collectPropsPreview ({ propsMain }) {
    return {
      title: propsMain.title
    }
  },
  plainTextFromProps (props) {
    return `${props.title} (${props.language})`
  }
}
