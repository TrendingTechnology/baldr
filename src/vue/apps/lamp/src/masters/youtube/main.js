/**
 * Download videos in the mp4 container
 *
 *    youtube-dl -f bestvideo[ext=mp4]+bestaudio[ext=m4a]/mp4 3XzGNabztj8
 *
 * @module @bldr/lamp/masters/youtube
 */

import { convertMarkdownToHtml } from '@bldr/markdown-to-html'
import { validateMasterSpec } from '@bldr/lamp-core'
import { youtubeMaster } from '@bldr/presentation-parser'

function youtubeIdToUri (youtubeId) {
  return `ref:YT_${youtubeId}`
}

/**
 * https://stackoverflow.com/a/55890696/10193818
 *
 * Low quality
 * https://img.youtube.com/vi/[video-id]/sddefault.jpg
 *
 * medium quality
 * https://img.youtube.com/vi/[video-id]/mqdefault.jpg
 *
 * High quality
 * http://img.youtube.com/vi/[video-id]/hqdefault.jpg
 *
 * maximum resolution
 * http://img.youtube.com/vi/[video-id]/maxresdefault.jpg
 */
export function findPreviewHttpUrl (youtubeId, asset) {
  if (asset == null) {
    return `http://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
  } else {
    return asset.previewHttpUrl
  }
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
      const asset = this.$store.getters['media/assetByUri'](
        youtubeIdToUri(props.id)
      )
      youtubeMaster.checkAvailability(props.id).then(result => {
        if (!result) {
          this.$showMessage.error(
            `The YouTube video “${props.id}” is no longer available online.`
          )
        }
      })
      const propsMain = Object.assign({}, props)
      propsMain.asset = asset
      if (asset != null) {
        if (props.heading == null && asset.yaml.heading != null) {
          propsMain.heading = convertMarkdownToHtml(asset.yaml.heading)
        } else if (
          props.heading == null &&
          asset.yaml.originalHeading != null
        ) {
          propsMain.heading = convertMarkdownToHtml(asset.yaml.originalHeading)
        }
        if (props.info == null && asset.yaml.info != null) {
          propsMain.info = convertMarkdownToHtml(asset.yaml.info)
        } else if (props.info == null && asset.yaml.originalInfo != null) {
          propsMain.info = convertMarkdownToHtml(asset.yaml.originalInfo)
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
        const sample = this.$store.getters['media/sampleByUri'](uri)
        const videoWrapper = document.querySelector('#youtube-offline-video')
        videoWrapper.innerHTML = ''
        videoWrapper.appendChild(sample.htmlElement)
        this.$media.player.load(uri)
      }
    }
  }
})
