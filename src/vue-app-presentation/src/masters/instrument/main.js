import { GrabFromObjects } from '@/lib.js'

export default {
  title: 'Instrument',
  props: {
    name: {
      type: String,
      description: 'Der Name des Instruments'
    },
    image: {
      type: String,
      required: true,
      mediaFileUri: true,
      description: 'Eine URI zu einer Bild-Datei.'
    },
    audio: {
      type: String,
      mediaFileUri: true,
      description: 'Eine URI zu einer Audio-Datei.'
    },
  },
  icon: {
    name: 'trumpet',
    color: 'gray'
  },
  styleConfig: {
    centerVertically: true,
    darkMode: true
  },
  normalizeProps (props) {
    if (typeof props === 'string') {
      return {
        image: `id:${props}_BD`,
        audio: `id:${props}_HB`
      }
    }
    return props
  },
  resolveMediaUris (props) {
    return [props.image, props.audio]
  },
  titleFromProps (props) {
    if (props.name) {
      return props.name
    } else {
      return props.image
    }
  },
  collectPropsMain (props) {
    const image = this.$store.getters['media/mediaFileByUri'](props.image)
    const grab = new GrabFromObjects(props, image, false)
    const result = grab.multipleProperties(['name'])
    result.imageHttpUrl = image.httpUrl
    if (props.audio) {
      result.sample = this.$store.getters['media/sampleByUri'](props.audio)
    }
    return result
  },
  collectPropsPreview ({ propsMain }) {
    return {
      imageHttpUrl: propsMain.imageHttpUrl,
      name: propsMain.name
    }
  },
  async enterSlide ({ newProps }) {
    this.$media.player.load(newProps.audio)
  },
}
