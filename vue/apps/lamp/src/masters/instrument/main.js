/**
 * @module @bldr/lamp/masters/instrument
 */

import { validateMasterSpec } from '../../lib/masters'

function convertInstrumentIdToMediaId (instrumentId) {
  return `ref:IN_${instrumentId}`
}

export default validateMasterSpec({
  name: 'instrument',
  title: 'Instrument',
  propsDef: {
    instrumentId: {
      type: String,
      description:
        'Die ID des Instruments. Gleichlautend wie der Ordner in dem alle Medieninhalte liegen (z. B. Floete)'
    }
  },
  icon: {
    name: 'instrument',
    color: 'yellow'
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
      const asset = this.$store.getters['lamp/mediaNg/assetByUri'](
        convertInstrumentIdToMediaId(props.instrumentId)
      )
      const propsMain = { asset }
      return propsMain
    },
    titleFromProps ({ propsMain }) {
      return propsMain.asset.name
    }
  }
})
