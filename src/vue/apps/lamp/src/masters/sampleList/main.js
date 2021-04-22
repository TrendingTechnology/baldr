/**
 * @module @bldr/lamp/masters/sampleList
 */

import { WrappedSampleList } from '@bldr/media-client'

import { validateMasterSpec } from '@bldr/master-toolkit'
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
      props.samples = new WrappedSampleList(props.samples)
      return props
    },
    resolveMediaUris (props) {
      return props.samples.uris
    },
    collectPropsMain (props) {
      return props
    },
    titleFromProps ({ props, propsMain }) {
      if (props.heading) return props.heading
      return 'Audio-Ausschnitte'
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
