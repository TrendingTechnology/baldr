/**
 * @module @bldr/lamp/masters/instrument
 */

import { WrappedSampleList } from '@bldr/media-client'
import { validateMasterSpec } from '@bldr/master-toolkit'

function convertInstrumentIdToMediaId (instrumentId) {
  return `id:IN_${instrumentId}`
}

export default validateMasterSpec({
  name: 'instrument',
  title: 'Instrument',
  propsDef: {
    instrumentId: {
      type: String,
      description: 'Die ID des Instruments. Gleichlautend wie der Ordner in dem alle Medieninhalte liegen (z. B. Floete)'
    }
  },
  icon: {
    name: 'trumpet',
    color: 'gray'
  },
  styleConfig: {
    centerVertically: true,
    darkMode: true
  },
  hooks: {
    normalizeProps (props) {
      if (typeof props === 'string') {
        props = {
          instrumentId: props
        }
      }
      return props
    },
    resolveMediaUris (props) {
      return convertInstrumentIdToMediaId(props.instrumentId)
    },
    collectPropsMain (props) {
      const asset = this.$store.getters['media/assetByUri'](convertInstrumentIdToMediaId(props.instrumentId))
      const propsMain = { asset }
      if (asset.audioSamples) {
        propsMain.wrappedSampleList = new WrappedSampleList(asset.audioSamples)
      }
      return propsMain
    },
    titleFromProps ({ propsMain }) {
      return propsMain.asset.name
    },
    async afterSlideNoChangeOnComponent () {
      if (!this.isPublic) return
      const slide = this.$get('slide')
      if (slide.propsMain.wrappedSampleList) {
        this.$media.player.load(slide.propsMain.wrappedSampleList.samples[0].sample)
      }
    }
  }
})
