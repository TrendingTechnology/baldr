export default {
  title: 'Zitat',
  props: {
    text: {
      type: String,
      required: true,
      markup: true,
      description: 'Haupttext des Zitats.'
    },
    author: {
      type: String,
      description: 'Der Autor des Zitats.'
    },
    date: {
      type: [String, Number],
      description: 'Datum des Zitats.'
    },
    source: {
      type: String,
      markup: true,
      description: 'Die Quelle des Zitats'
    },
    prolog: {
      type: String,
      markup: true,
      description: 'Längerer Text, der vor dem Zitat erscheint.'
    },
    epilog: {
      type: String,
      markup: true,
      description: 'Kürzerer Text, der vor dem Zitat erscheint.'
    }
  },
  icon: {
    name: 'comment-quote',
    color: 'brown',
    size: 'large'
  },
  styleConfig: {
    centerVertically: true,
    darkMode: true
  },
  plainTextFromProps (props) {
    return Object.values(props).join(' | ')
  },
  normalizeProps (props) {
    if (typeof props === 'string') {
      return {
        text: props
      }
    }
    return props
  }
}
