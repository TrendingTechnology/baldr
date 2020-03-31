export default {
  title: 'Gruppe',
  props: {
    mainImage: {
      type: String,
      required: true,
      mediaFileUri: true,
      description: 'Eine URI zu der Haupt-Bild-Datei.'
    }
  },
  icon: {
    name: 'account-group',
    color: 'orange'
  },
  styleConfig: {
    centerVertically: true,
    darkMode: true
  },
  hooks: {
    normalizeProps (props) {
      if (typeof props === 'string') {
        return {
          mainImage: props
        }
      }
      return props
    },
    resolveMediaUris (props) {
      return props.mainImage
    },
    titleFromProps (props) {
      if (props.mainImage) {
        return props.mainImage
      }
    }
  }
}
