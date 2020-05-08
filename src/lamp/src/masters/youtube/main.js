/**
 * Download videos in the mp4 container
 *
 *    youtube-dl -f 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/mp4' 3XzGNabztj8
 *
 * @module @bldr/lamp/masters/youtube
 */

function youtubeIdToUri (youtubeId) {
  return `id:YT_${youtubeId}`
}

export default {
  title: 'YouTube',
  props: {
    id: {
      type: String,
      required: true,
      description: 'Die Youtube-ID (z. B. xtKavZG1KiM).'
    },
    heading: {
      type: String,
      description: 'Eigene Überschrift',
      markup: true
    },
    info: {
      type: String,
      description: 'längerer Informations-Text',
      markup: true
    }
  },
  icon: {
    name: 'youtube',
    color: 'red'
  },
  styleConfig: {
    centerVertically: true,
    darkMode: true
  },
  hooks: {
    normalizeProps (props) {
      if (typeof props === 'string') {
        props = { id: props }
      }
      return props
    },
    resolveMediaUris (props) {
      return youtubeIdToUri(props.id)
    },
    collectPropsMain (props) {
      const asset = this.$store.getters['media/assetByUri'](youtubeIdToUri(props.id))
      const propsMain = Object.assign({}, props)
      propsMain.asset = asset
      return propsMain
    },
    plainTextFromProps (props) {
      return props.id
    },
    // no enterSlide hook: $media is not ready yet.
    async afterSlideNoChangeOnComponent () {
      if (!this.isPublic) return
      const slide = this.$get('slide')
      if (slide.propsMain.asset) {
        const sample = this.$store.getters['media/sampleByUri'](youtubeIdToUri(slide.props.id))
        const videoWrapper = document.querySelector('#youtube-offline-video')
        videoWrapper.innerHTML = ''
        videoWrapper.appendChild(sample.mediaElement)
        this.$media.player.load(slide.props.src)
        if (slide.props.autoplay) {
          await this.$media.player.start()
        }
      }
    }
  }
}
