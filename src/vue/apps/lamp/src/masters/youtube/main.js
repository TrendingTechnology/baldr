/**
 * Download videos in the mp4 container
 *
 *    youtube-dl -f bestvideo[ext=mp4]+bestaudio[ext=m4a]/mp4 3XzGNabztj8
 *
 * @module @bldr/lamp/masters/youtube
 */

import { convertMarkdownToHtml } from '@bldr/markdown-to-html'
import { validateMasterSpec } from '@bldr/lamp-core'
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
        props = { youtubeId: props }
      }
      return props
    },
    resolveOptionalMediaUris (props) {
      return youtubeMModule.convertYoutubeIdToUri(props.youtubeId)
    },
    collectPropsMain (props) {
      const asset = this.$store.getters['media/assetByUri'](
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
      return props.youtubeId
    }
  }
})
