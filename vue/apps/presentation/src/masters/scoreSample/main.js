/**
 * @module @bldr/presentation/masters/scoreSample
 */

import { validateMasterSpec } from '../../lib/masters'

import { resolver } from '@bldr/presentation-parser'

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
    name: 'master-score-sample',
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
      if ('audio' in props) {
        uris.add(props.audio)
      }
      return uris
    },
    collectPropsMain (props) {
      let audioSample
      let audio
      if (props.audio != null) {
        audio = this.$store.getters['presentation/media/sampleByUri'](props.audio)
      }

      if (audio) {
        audioSample = audio
      }
      let asset
      if (props.score.indexOf('#') > -1) {
        asset = resolver.getMultipartSelection(props.score)
      } else {
        asset = this.$store.getters['presentation/media/assetByUri'](props.score)
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
      if (props.heading) {
        propsPreview.heading = props.heading
      }
      if (propsMain.asset.multiPartCount > 1) {
        propsPreview.isMultiPart = true
      }
      return propsPreview
    },
    calculateStepCount ({ propsMain }) {
      return propsMain.asset.multiPartCount
    }
  }
})
