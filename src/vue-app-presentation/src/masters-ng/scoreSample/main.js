
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

const getters = {
  ...mapPresentationGetters(['slideCurrent']),
  ...mapMediaGetters(['mediaFileByUri', 'sampleByUri'])
}

export default {
  title: 'Notenbeispiel',
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
      scoreHttpUrl : this.$store.getters['media/mediaFileByUri'](props.score).httpUrl,
      audioHttpUrl: this.$store.getters['media/sampleByUri'](props.audio).httpUrl
    }
  },
  collectPropsPreview ({ propsMain }) {
    return {
      httpUrl: propsMain.scoreHttpUrl
    }
  }
}
