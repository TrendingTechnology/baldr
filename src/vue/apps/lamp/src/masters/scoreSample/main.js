/**
 * @module @bldr/lamp/masters/scoreSample
 */

import { validateMasterSpec } from '../../lib/masters'

export default validateMasterSpec({
  name: 'score',
  title: 'Notenbeispiel',
  propsDef: {
    heading: {
      type: String,
      description: 'Eine Überschrift',
      markup: true
    },
    score: {
      type: String,
      description: 'URI zu einer Bild-Datei, dem Notenbeispiel.',
      assetUri: true,
      required: true
    },
    audio: {
      type: String,
      description: 'URI der entsprechenden Audio-Datei oder des Samples.',
      assetUri: true
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
      let asset
      const multiPartSelection = this.$store.getters['media/multiPartSelectionByUri'](props.score)
      if (multiPartSelection) {
        asset = multiPartSelection
      } else {
        asset = this.$store.getters['media/assetByUri'](props.score)
      }

      return {
        heading: props.heading,
        asset,
        audioSample
      }
    },
    collectPropsPreview ({ props, propsMain }) {
      const propsPreview = {
        scoreHttpUrl: propsMain.asset.httpUrl
      }
      if (props.audio) {
        propsPreview.hasAudio = true
      }
      if (propsMain.asset.partCount > 1) {
        propsPreview.isMultiPart = true
      }
      return propsPreview
    },
    calculateStepCount ({ props, propsMain }) {
      return propsMain.asset.multiPartCount
    }
  }
})
