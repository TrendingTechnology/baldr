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
    color: 'black'
  },
  styleConfig: {
    centerVertically: true,
    darkMode: false
  },
  resolveMediaUris (props) {
    const uris = new Set([props.score])
    if ('audio' in props) uris.add(props.audio)
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
    let audioSample
    const audio = this.$store.getters['media/sampleByUri'](props.audio)
    if (audio) {
      audioSample = audio
    }
    let scoreMediaFile
    const muliPartSelection = this.$store.getters['media/multiPartSelectionByUri'](props.score)
    if (muliPartSelection) {
      scoreMediaFile = muliPartSelection
    } else {
      scoreMediaFile = this.$store.getters['media/mediaFileByUri'](props.score)
    }

    return {
      heading: props.heading,
      scoreMediaFile,
      audioSample
    }
  },
  collectPropsPreview ({ props, propsMain }) {
    const propsPreview = {
      scoreHttpUrl: propsMain.scoreMediaFile.httpUrl
    }
    if (props.audio) {
      propsPreview.hasAudio = true
    }
    return propsPreview
  },
  calculateStepCount ({ props }) {
    const muliPartSelection = this.$store.getters['media/multiPartSelectionByUri'](props.score)
    if (muliPartSelection) {
      return muliPartSelection.partCount
    }
  }
}
