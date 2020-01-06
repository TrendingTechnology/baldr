
import { createNamespacedHelpers } from 'vuex'
const mapPresentationGetters = createNamespacedHelpers('presentation').mapGetters
const mapMediaGetters = createNamespacedHelpers('media').mapGetters

const example = `
---
slides:

- score_sample: id:Foto-Savoyarden-Musikanten-mit-Murmeltier

- score_sample:
    score: id:Foto-Savoyarden-Musikanten-mit-Murmeltier
    audio: id:Fischer-Dieskau_Marmotte
`

export default {
  title: 'Notenbeispiel',
  props: {
    heading: {
      type: String,
      description: 'Eine Überschrift',
      markup: true
    },
    score: {
      type: String,
      description: 'URI zu einer Bild-Datei, dem Notenbeispiel.',
      mediaFileUri: true,
      required: true
    },
    audio: {
      type: String,
      description: 'URI der entsprechenden Audio-Datei oder des Samples.',
      mediaFileUri: true
    }
  },
  icon: {
    name: 'file-audio',
    color: 'black',
  },
  styleConfig: {
    centerVertically: true,
    darkMode: false
  },
  example,
  resolveMediaUris (props) {
    const uris = []
    uris.push(props.score)
    if ('audio' in props) uris.push(props.audio)
    return uris
  },
  enterSlide ({ newProps }) {
    if ('audio' in newProps) this.$media.player.load(newProps.audio)
  },
  normalizeProps (props) {
    if (typeof props === 'string') {
      return {
        score: props
      }
    }
    return props
  },
  collectPropsMain (props) {
    return {
      heading: props.heading,
      scoreHttpUrl: this.$store.getters['media/mediaFileByUri'](props.score).httpUrl,
      audioHttpUrl: this.$store.getters['media/sampleByUri'](props.audio).httpUrl
    }
  },
  collectPropsPreview ({ propsMain }) {
    return {
      scoreHttpUrl: propsMain.scoreHttpUrl
    }
  }
}