const example = `
---
slides:

- title: short from
  quote: Short form quote

- title: All properties
  quote:
    text: Der Tag der Gunst ist wie der Tag der Ernte, man muss geschäftig sein sobald sie reift.
    author: Johann Wolfgang von Goethe
    date: 1801

- title: Only text
  quote:
    text: Der Tag der Gunst ist wie der Tag der Ernte, man muss geschäftig sein sobald sie reift.

- title: Markup support
  quote:
    text: 'With markup: __This text should be displayed as a bold text.__'

- title: Prop source
  quote:
    text: 'With prop source'
    author: Johann Wolfgang von Goethe
    date: 1801
    source: Doktor Fastus
`

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
  example,
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
