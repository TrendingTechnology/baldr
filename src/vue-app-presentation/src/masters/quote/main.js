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
    const output = []
    if ('text' in props) output.push(props.text)
    if ('author' in props) output.push(props.author)
    if ('date' in props) output.push(props.date)
    return output.join(' | ')
  },
  normalizeProps (props) {
    if (typeof props === 'string') {
      return {
        text: props
      }
    }
    return props
  },
}
