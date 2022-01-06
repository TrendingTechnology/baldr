/**
 * @module @bldr/lamp/masters/sampleList
 */

import type { LampTypes } from '@bldr/type-definitions'

// import { mediaResolver } from '@bldr/media-client'
import { validateMasterSpec } from '../../lib/masters'

export default validateMasterSpec({
  name: 'sampleList',
  title: 'Audio-Ausschnitte',
  propsDef: {
    samples: {
      type: Array,
      required: true,
      description: 'Eine Liste von Audio-Ausschnitten.'
    },
    heading: {
      type: String,
      markup: true,
      description: 'Überschrift der Ausschnitte.',
      required: false
    },
    notNumbered: {
      type: Boolean,
      description: 'Nicht durchnummeriert'
    }
  },
  icon: {
    name: 'music',
    color: 'red'
  },
  styleConfig: {
    centerVertically: true,
    darkMode: true
  },
  hooks: {
    normalizeProps (props): LampTypes.StringIndexedData {
      if (typeof props === 'string' || Array.isArray(props)) {
        props = { samples: props }
      }
      return props
    },
    // resolveMediaUris (props) {
    //   return mediaResolver.getUrisFromWrappedSpecs(props.samples)
    // },
    collectPropsMain (props): LampTypes.StringIndexedData {
      return props
    },
    titleFromProps ({ props }): string {
      if (props.heading) {
        return props.heading
      }
      return 'Audio-Ausschnitte'
    },
    // async afterMediaResolution ({ props }) {
    //   const wrappedSampleList = mediaResolver.getWrappedSampleList(props.samples)
    //   const samplesCollection = wrappedSampleList.getSamplesFromFirst()
    //   if (samplesCollection != null) {
    //     props.samples = samplesCollection
    //   } else {
    //     props.samples = wrappedSampleList
    //   }
    // }
  }
})
