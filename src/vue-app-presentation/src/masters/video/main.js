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
  normalizeProps (props) {
    if (typeof props === 'string') {
      props = { src: props }
    }
    return props
  },
  resolveMediaUris (props) {
    return [props.src]
  },
  async enterSlide ({ newProps }) {
    const sample = this.$store.getters['media/sampleByUri'](newProps.src)
    const videoWrapper = document.querySelector('.vc_video_master')
    videoWrapper.appendChild(sample.mediaElement)

    this.$media.player.load(newProps.src)
    if (newProps.autoplay) {
      await this.$media.player.start()
    }
  },
  collectPropsMain (props) {
    const mediaFile = this.$store.getters['media/mediaFileByUri'](props.src)
    return {
      httpUrl: mediaFile.httpUrl,
      previewHttpUrl: mediaFile.previewHttpUrl
    }
  },
  collectPropsPreview ({ propsMain }) {
    return {
      previewHttpUrl: propsMain.previewHttpUrl
    }
  }
}
