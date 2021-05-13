/**
 * Download videos in the mp4 container
 *
 *    youtube-dl -f bestvideo[ext=mp4]+bestaudio[ext=m4a]/mp4 3XzGNabztj8
 *
 * @module @bldr/lamp/masters/youtube
 */

import { convertMarkdownToHtml } from '@bldr/markdown-to-html'
import { validateMasterSpec } from '@bldr/master-toolkit'

function youtubeIdToUri (youtubeId) {
  return `ref:YT_${youtubeId}`
}

export default validateMasterSpec({
  name: 'youtube',
  title: 'YouTube',
  propsDef: {
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
    resolveOptionalMediaUris (props) {
      return youtubeIdToUri(props.id)
    },
    collectPropsMain (props) {
      const asset = this.$store.getters['media/assetByUri'](youtubeIdToUri(props.id))
      const propsMain = Object.assign({}, props)
      propsMain.asset = asset
      if (asset) {
        if (!props.heading && asset.heading) {
          propsMain.heading = convertMarkdownToHtml(asset.heading)
        } else if (!props.heading && asset.originalHeading) {
          propsMain.heading = convertMarkdownToHtml(asset.originalHeading)
        }
        if (!props.info && asset.info) {
          propsMain.info = convertMarkdownToHtml(asset.info)
        } else if (!props.info && asset.originalInfo) {
          propsMain.info = convertMarkdownToHtml(asset.originalInfo)
        }
      }
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
        const uri = youtubeIdToUri(slide.props.id)
        const sample = this.$store.getters['media/sampleNgByUri'](uri)
        const videoWrapper = document.querySelector('#youtube-offline-video')
        videoWrapper.innerHTML = ''
        videoWrapper.appendChild(sample.mediaElement)
        this.$media.player.load(uri)
      }
    }
  }
})
