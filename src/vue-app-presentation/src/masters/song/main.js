export default {
  title: 'Lied',
  props: {
    songId: {
      type: String,
      description: 'Die ID des Liedes',
    },
    imageUri: {
      type: String,
      description: 'URI zu einer mehrteiligen speziellen Bild-Datei mit Lied-Informationen.'
    }
  },
  icon: {
    name: 'file-audio',
    color: 'green'
  },
  styleConfig: {
    centerVertically: true,
    darkMode: false
  },
  resolveMediaUris (props) {
    return props.imageUri
  },
  normalizeProps (props) {
    const propsNormalized = {}
    if (typeof props === 'string') {
      propsNormalized.songId = props
    } else {
      propsNormalized = props
    }
    if (!propsNormalized.imageUri) {
      propsNormalized.imageUri = `id:Lied_${propsNormalized.songId}_NB`
    }
    return propsNormalized
  },
  calculateStepCount (props) {
    const image = this.$store.getters['media/mediaFileByUri'](props.imageUri)
    return image.multiPartCountActual
  },
  collectPropsMain (props) {
    const image = this.$store.getters['media/mediaFileByUri'](props.imageUri)
    return {
      image
    }
  },
  collectPropsPreview ({ propsMain }) {
    return {
      imageHttpUrl: propsMain.image.httpUrl
    }
  }
}
