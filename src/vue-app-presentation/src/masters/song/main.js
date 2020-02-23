export default {
  title: 'Lied',
  props: {
    songId: {
      type: String,
      description: 'Die ID des Liedes',
    },
    multiPartImageUri: {
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
    return [props.multiPartImageUri]
  },
  normalizeProps (props) {
    const propsNormalized = {}
    if (typeof props === 'string') {
      propsNormalized.songId = props
    } else {
      propsNormalized = props
    }
    if (!propsNormalized.multiPartImageUri) {
      propsNormalized.multiPartImageUri = `id:Lied_${propsNormalized.songId}_NB`
    }
    return propsNormalized
  },
  calculateStepCount (props) {
    const multiPartImage = this.$store.getters['media/mediaFileByUri'](props.multiPartImageUri)
    return multiPartImage.multiPartCountActual
  },
  collectPropsMain (props) {
    const multiPartImage = this.$store.getters['media/mediaFileByUri'](props.multiPartImageUri)
    return {
      multiPartImage
    }
  }
}
