/**
 * @module @bldr/lamp/masters/video
 */

export default {
  title: 'Video',
  props: {
    src: {
      type: String,
      required: true,
      description: 'Den URI zu einer Video-Datei.',
      mediaFileUri: true
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
      const mediaFile = this.$store.getters['media/assetByUri'](props.src)
      return {
        httpUrl: mediaFile.httpUrl,
        previewHttpUrl: mediaFile.previewHttpUrl
      }
    },
    collectPropsPreview ({ propsMain }) {
      return {
        previewHttpUrl: propsMain.previewHttpUrl
      }
    },
    // no enterSlide hook: $media is not ready yet.
    async afterSlideNoChangeOnComponent () {
      if (!this.isPublic) return
      const slide = this.$get('slide')
      const sample = this.$store.getters['media/sampleByUri'](slide.props.src)
      const videoWrapper = document.querySelector('.vc_video_master')
      videoWrapper.innerHTML = ''
      videoWrapper.appendChild(sample.mediaElement)
      this.$media.player.load(slide.props.src)
      if (slide.props.autoplay) {
        await this.$media.player.start()
      }
    }
  }
}
