/**
 * @module @bldr/lamp/masters/song
 */

import { validateMasterSpec } from '@bldr/master-toolkit'

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
    name: 'file-audio',
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
      const image = this.$store.getters['media/assetNgByUri'](convertSongIdToRef(props.songId))
      return image.multiPartCount
    },
    collectPropsMain (props) {
      const image = this.$store.getters['media/assetNgByUri'](convertSongIdToRef(props.songId))
      return {
        image
      }
    },
    collectPropsPreview ({ propsMain }) {
      return {
        imageHttpUrl: propsMain.image.httpUrl,
        title: propsMain.image.yaml.title
      }
    }
  }
})
