/**
 * Download videos in the mp4 container
 *
 *    youtube-dl -f bestvideo[ext=mp4]+bestaudio[ext=m4a]/mp4 3XzGNabztj8
 *
 * @module @bldr/presentation/masters/youtube
 */

import { convertMarkdownToHtml } from '@bldr/markdown-to-html'
import { validateMasterSpec } from '../../lib/masters'
import { youtubeMModule } from '@bldr/presentation-parser'

export default validateMasterSpec({
  name: 'youtube',
  title: 'YouTube',
  propsDef: {
    youtubeId: {
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
    name: 'master-youtube',
    color: 'red'
  },
  styleConfig: {
    centerVertically: true,
    darkMode: true
  },
  hooks: {
    normalizeProps (props) {
      if (typeof props === 'string') {
        props = { youtubeId: props }
      }
      return props
    },
    resolveOptionalMediaUris (props) {
      return youtubeMModule.convertYoutubeIdToUri(props.youtubeId)
    },
    collectPropsMain (props) {
      const asset = this.$store.getters['presentation/media/assetByUri'](
        youtubeMModule.convertYoutubeIdToUri(props.youtubeId)
      )
      youtubeMModule.checkAvailability(props.youtubeId).then(result => {
        if (!result) {
          this.$showMessage.error(
            `The YouTube video “${props.youtubeId}” is no longer available online.`
          )
        }
      })
      const propsMain = Object.assign({}, props)
      propsMain.asset = asset
      if (asset != null) {
        if (props.heading == null && asset.meta.heading != null) {
          propsMain.heading = convertMarkdownToHtml(asset.meta.heading)
        } else if (
          props.heading == null &&
          asset.meta.originalHeading != null
        ) {
          propsMain.heading = convertMarkdownToHtml(asset.meta.originalHeading)
        }
        if (props.info == null && asset.meta.info != null) {
          propsMain.info = convertMarkdownToHtml(asset.meta.info)
        } else if (props.info == null && asset.meta.originalInfo != null) {
          propsMain.info = convertMarkdownToHtml(asset.meta.originalInfo)
        }
      }
      return propsMain
    },
    plainTextFromProps (props) {
      return props.youtubeId
    }
  }
})
