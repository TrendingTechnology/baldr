const defaultLanguage = 'de'

const example = `
---
slides:

- title: Short form
  wikipedia: Franz_Seraph_Reicheneder

- title: Long form
  wikipedia:
    language: en
    title: Ludwig_van_Beethoven

- title: Long form (German Umlaute)
  wikipedia:
    title: August_Högn
`

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
  example,
  normalizeProps (props) {
    if (typeof props === 'string') {
      props = { title: props }
    }
    if (!props.language) props.language = defaultLanguage
    return props
  },
  plainTextFromProps (props) {
    return `${props.title} (${props.language})`
  },
  collectPropsMain (props) {
    return {
      title: props.title,
      httpUrl: `https://${props.language}.wikipedia.org/wiki/${props.title}`,
      iframeHttpUrl: `https://${props.language}.wikipedia.org/w/index.php?title=${props.title}&printable=yes`,
    }
  },
  collectPropsPreview ({ propsMain }) {
    return {
      title: propsMain.title
    }
  }
}
