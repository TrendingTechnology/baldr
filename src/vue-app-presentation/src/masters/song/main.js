export default {
  title: 'Lied',
  props: {
    songId: {
      type: String,
      description: 'Die ID des Liedes',
    },
    image: {
      type: String,
      description: 'URI zu einer mehrteiligen speziellen Bild-Datein mit Lied-Informationen.'
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
    return [props.image]
  },
  normalizeProps (props) {
    const propsNormalized = {}
    if (typeof props === 'string') {
      propsNormalized.songId = props
    } else {
      propsNormalized = props
    }
    if (!propsNormalized.image) {
      propsNormalized.image = `id:Lied_${propsNormalized.songId}_NB`
    }
    return propsNormalized
  },
  collectPropsMain (props) {
    console.log(props)
    const imageMediaFile = this.$store.getters['media/mediaFileByUri'](props.image)
    let imageHttpUrl = imageMediaFile.httpUrl
    return {
      imageHttpUrl
    }
  }
}
