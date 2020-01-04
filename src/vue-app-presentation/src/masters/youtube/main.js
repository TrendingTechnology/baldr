const example = `
---
slides:

- title: Short form
  youtube: 5BBahdS6wu4

- title: Long form
  youtube:
    id: xtKavZG1KiM
`

export default {
  title: 'YouTube',
  props: {
    id: {
      type: String,
      required: true,
      description: 'Die Youtube-ID (z. B. xtKavZG1KiM).'
    }
  },
  icon: {
    name: 'youtube',
    color: 'red'
  },
  styleConfig: {
    centerVertically: true,
    darkMode: true
  },
  example,
  normalizeProps (props) {
    if (typeof props === 'string') {
      props = { id: props }
    }
    return props
  },
  plainTextFromProps (props) {
    return props.id
  }
}
