/**
 * @module @bldr/presentation/masters/video
 */

import { validateMasterSpec } from '../../lib/masters'

export default validateMasterSpec({
  name: 'video',
  title: 'Video',
  propsDef: {
    src: {
      type: String,
      required: true,
      description: 'Den URI zu einer Video-Datei.',
      assetUri: true
    },
    showMeta: {
      type: Boolean,
      description: 'Zeige Metainformationen'
    }
  },
  icon: {
    name: 'master-video',
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
      const asset = this.$store.getters['presentation/media/assetByUri'](props.src)
      const result = {
        httpUrl: asset.httpUrl,
        previewHttpUrl: asset.previewHttpUrl
      }
      if (props.showMeta != null) {
        result.showMeta = true
      }
      if (asset.meta.title != null) {
        result.title = asset.meta.title
      }
      if (asset.meta.description != null) {
        result.description = asset.meta.description
      }
      return result
    }
  }
})
