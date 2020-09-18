/**
 * @module @bldr/lamp/masters/sampleList
 */

import { GrabFromObjects } from '@/lib.js'

export default {
  title: 'Audio-Ausschnitte',
  props: {
    samples: {
      type: Array,
      required: true,
      description: 'Eine Liste von Audio-Ausschnitten.',
      assetUri: true
    },
    heading: {
      type: String,
      markup: true,
      description: 'Überschrift der Ausschnitte.',
      required: false
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
      if (typeof props === 'string') {
        props = { samples: props }
      }
      if (typeof props.samples === 'string') {
        props.samples = [props.samples]
      }
      return props
    },
    resolveMediaUris (props) {
      return props.samples
    },
    collectPropsMain (props) {
      const sample = this.$store.getters['media/sampleByUri'](props.src)
      const asset = sample.asset

      const grab = new GrabFromObjects(props, asset)
      const artist = grab.property('artist')
      const composer = grab.property('composer')
      const description = grab.property('description')
      const partOf = grab.property('partOf')

      let title
      if (props.title) {
        title = props.title
      } else {
        title = sample.titleSafe
      }

      let previewHttpUrl
      if (props.cover) {
        const coverFile = this.$store.getters['media/assetByUri'](props.cover)
        previewHttpUrl = coverFile.httpUrl
      } else if ('previewHttpUrl' in asset) {
        previewHttpUrl = asset.previewHttpUrl
      }
      return {
        sample,
        previewHttpUrl,
        artist,
        composer,
        title,
        partOf,
        description,
        mediaAsset: asset
      }
    },
    titleFromProps ({ props, propsMain }) {
      if (props.title) return props.title
      const asset = propsMain.mediaAsset
      if (asset.title) return asset.title
    },
    // no enterSlide hook: $media is not ready yet.
    async afterSlideNoChangeOnComponent () {
      if (!this.isPublic) return
      const slide = this.$get('slide')
      this.$media.player.load(slide.props.src)
      if (slide.props.autoplay) {
        await this.$media.player.start()
      }
    }
  }
}
