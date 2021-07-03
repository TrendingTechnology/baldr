/**
 * @module @bldr/lamp/masters/sampleList
 */

import { mediaResolver } from '@bldr/media-client'
import { validateMasterSpec } from '@bldr/lamp-core'

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
    normalizeProps (props) {
      if (typeof props === 'string' || Array.isArray(props)) {
        props = { samples: props }
      }
      return props
    },
    resolveMediaUris (props) {
      return mediaResolver.getUrisFromWrappedSpecs(props.samples)
    },
    collectPropsMain (props) {
      return props
    },
    titleFromProps ({ props }) {
      if (props.heading) {
        return props.heading
      }
      return 'Audio-Ausschnitte'
    },
    async afterMediaResolution ({ props }) {
      const wrappedSampleList = mediaResolver.getWrappedSampleList(props.samples)
      const samplesCollection = wrappedSampleList.getSamplesFromFirst()
      if (samplesCollection != null) {
        props.samples = samplesCollection
      } else {
        props.samples = wrappedSampleList
      }
    }
    // no enterSlide hook: $media is not ready yet.
    // async afterSlideNoChangeOnComponent () {
    //   if (!this.isPublic) return
    //   const slide = this.$get('slide')
    //   this.$media.player.load(slide.props.samples.uris[0])
    //   if (slide.props.autoplay) {
    //     await this.$media.player.start()
    //   }
    // }
  }
})
