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
    const scoreMediaFile = this.$store.getters['media/mediaFileByUri'](props.score)

    // All parts
    // id:Strawinsky-Petruschka_NB_Abschnitt-23-29-Systeme

    // Part 1
    // id:Strawinsky-Petruschka_NB_Abschnitt-23-29-Systeme#1

    // Part 2
    // id:Strawinsky-Petruschka_NB_Abschnitt-23-29-Systeme#2
    let scoreHttpUrl = scoreMediaFile.httpUrl
    let scorePartNo = null
    if (props.score.indexOf('#') > -1) {
      const segments = props.score.split('#')
      scorePartNo = parseInt(segments[1])
      scoreHttpUrl = scoreMediaFile.multiPartHttpUrl(scorePartNo)
    }
    return {
      heading: props.heading,
      scoreMediaFile,
      scoreHttpUrl,
      scorePartNo,
      audioSample
    }
  },
  calculateStepCount (props) {
    if (props.score.indexOf('#') > -1) {
      return
    }
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
