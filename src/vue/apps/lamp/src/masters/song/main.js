/**
 * @module @bldr/lamp/masters/song
 */

import { validateMasterSpec } from '@bldr/master-toolkit'

export default validateMasterSpec({
  name: 'song',
  title: 'Lied',
  propsDef: {
    songId: {
      type: String,
      description: 'Die ID des Liedes'
    },
    imageUri: {
      type: String,
      description: 'URI zu einer mehrteiligen speziellen Bild-Datei mit Lied-Informationen.'
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
      if (!propsNormalized.imageUri) {
        propsNormalized.imageUri = `id:Lied_${propsNormalized.songId}_NB`
      }
      return propsNormalized
    },
    resolveMediaUris (props) {
      return props.imageUri
    },
    calculateStepCount ({ props }) {
      const image = this.$store.getters['media/assetByUri'](props.imageUri)
      return image.multiPartCountActual
    },
    collectPropsMain (props) {
      const image = this.$store.getters['media/assetByUri'](props.imageUri)
      return {
        image
      }
    },
    collectPropsPreview ({ propsMain }) {
      return {
        imageHttpUrl: propsMain.image.httpUrl,
        title: propsMain.image.titleCombined
      }
    }
  }
})
