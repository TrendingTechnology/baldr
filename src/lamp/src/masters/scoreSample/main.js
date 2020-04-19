/**
 * @module @bldr/lamp/masters/scoreSample
 */

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
  hooks: {
    normalizeProps (props) {
      if (typeof props === 'string') {
        return {
          score: props
        }
      }
      return props
    },
    resolveMediaUris (props) {
      const uris = new Set([props.score])
      if ('audio' in props) uris.add(props.audio)
      return uris
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
      if (propsMain.scoreMediaFile.partCount > 1) {
        propsPreview.isMultiPart = true
      }
      return propsPreview
    },
    calculateStepCount ({ props }) {
      const muliPartSelection = this.$store.getters['media/multiPartSelectionByUri'](props.score)
      if (muliPartSelection) {
        return muliPartSelection.partCount
      }
    },
    // no enterSlide hook: $media is not ready yet.
    async afterSlideNoChangeOnComponent () {
      if (!this.isPublic) return
      const slide = this.$get('slide')
      if (!slide.props.audio) return
      this.$media.player.load(slide.props.audio)
    }
  }
}
