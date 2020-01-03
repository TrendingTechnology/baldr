import { plainText } from '@bldr/core-browser'

const example = `
---
slides:

- title: Short form
  section: A section

- title: Long form
  section:
    heading: A section
`

export default {
  title: 'Abschnitt',
  props: {
    heading: {
      type: String,
      required: true,
      markup: true,
      description: 'Die Überschrift / der Titel des Abschnitts.'
    }
  },
  icon: {
    name: 'file-tree',
    color: 'orange-dark'
  },
  styleConfig: {
    centerVertically: true,
    darkMode: true
  },
  example,
  normalizeProps (props) {
    if (typeof props === 'string') {
      props = { heading: props }
    }
    return props
  },
  plainTextFromProps (props) {
    return plainText(props.heading)
  },
  collectPropsMain (props) {
    return props
  },
  collectPropsPreview ({ propsMain }) {
    return propsMain
  }
}
