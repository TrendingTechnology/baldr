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
    let audioSample
    const audio = this.$store.getters['media/sampleByUri'](props.audio)
    if (audio) {
      audioSample = audio
    }
    const score = this.$store.getters['media/mediaFileByUri'](props.score)
    return {
      heading: props.heading,
      score,
      scoreHttpUrl: score.httpUrl,
      audioSample
    }
  },
  calculateStepCount (props) {
    const score = this.$store.getters['media/mediaFileByUri'](props.score)
    if (score.multiPartCount) {
      return score.multiPartCount
    }
  },
  collectPropsPreview ({ props, propsMain }) {
    const propsPreview = {
      scoreHttpUrl: propsMain.scoreHttpUrl
    }
    if (props.audio) {
      propsPreview.hasAudio = true
    }
    return propsPreview
  }
}
