/**
 * @module @bldr/lamp/masters/song
 */

import { validateMasterSpec } from '../../lib/masters'

function convertSongIdToRef (songId) {
  return `ref:LD_${songId}`
}

export default validateMasterSpec({
  name: 'song',
  title: 'Lied',
  propsDef: {
    songId: {
      type: String,
      description: 'Die ID des Liedes'
    }
  },
  icon: {
    name: 'master-song',
    color: 'green'
  },
  styleConfig: {
    centerVertically: true,
    darkMode: false
  },
  hooks: {
    normalizeProps (props) {
      let propsNormalized = {}
      if (typeof props === 'string') {
        propsNormalized.songId = props
      } else {
        propsNormalized = props
      }
      return propsNormalized
    },
    resolveMediaUris (props) {
      return convertSongIdToRef(props.songId)
    },
    calculateStepCount ({ props }) {
      const image = this.$store.getters['lamp/media/assetByUri'](
        convertSongIdToRef(props.songId)
      )
      return image.multiPartCount
    },
    collectPropsMain (props) {
      const image = this.$store.getters['lamp/media/assetByUri'](
        convertSongIdToRef(props.songId)
      )
      return {
        image
      }
    },
    collectPropsPreview ({ propsMain }) {
      return {
        imageHttpUrl: propsMain.image.httpUrl,
        title: propsMain.image.meta.title
      }
    }
  }
})
