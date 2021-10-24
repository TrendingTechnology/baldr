/**
 * @module @bldr/lamp/masters/video
 */

import { validateMasterSpec } from '@bldr/lamp-core'

export default validateMasterSpec({
  name: 'video',
  title: 'Video',
  propsDef: {
    src: {
      type: String,
      required: true,
      description: 'Den URI zu einer Video-Datei.',
      assetUri: true
    },
    showMeta: {
      type: Boolean,
      description: 'Zeige Metainformationen'
    }
  },
  icon: {
    name: 'video-vintage',
    color: 'purple'
  },
  styleConfig: {
    centerVertically: true,
    darkMode: true
  },
  hooks: {
    normalizeProps (props) {
      if (typeof props === 'string') {
        props = { src: props }
      }
      return props
    },
    resolveMediaUris (props) {
      return props.src
    },
    collectPropsMain (props) {
      const asset = this.$store.getters['media/assetByUri'](props.src)
      const result = {
        httpUrl: asset.httpUrl,
        previewHttpUrl: asset.previewHttpUrl
      }
      if (props.showMeta != null) {
        result.showMeta = true
      }
      if (asset.yaml.title != null) {
        result.title = asset.yaml.title
      }
      if (asset.yaml.description != null) {
        result.description = asset.yaml.description
      }
      return result
    },
    // no enterSlide hook: $media is not ready yet.
    async afterSlideNoChangeOnComponent () {
      if (!this.isPublic) return
      const slide = this.$get('slide')
      const sample = this.$store.getters['media/sampleByUri'](slide.props.src)
      const videoWrapper = document.querySelector('#video_master-container')
      videoWrapper.innerHTML = ''
      videoWrapper.appendChild(sample.htmlElement)
      this.$media.player.load(slide.props.src)
      if (slide.props.autoplay) {
        await this.$media.player.start()
      }
    }
  }
})
