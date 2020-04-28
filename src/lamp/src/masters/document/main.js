/**
 * @module @bldr/lamp/masters/document
 */

export default {
  title: 'Dokument',
  props: {
    src: {
      type: String,
      description: 'URI eines Dokuments.'
    }
  },
  icon: {
    name: 'file-outline',
    color: 'gray'
  },
  styleConfig: {
    centerVertically: false,
    overflow: false,
    contentTheme: 'default'
  },
  hooks: {
    normalizeProps (props) {
      if (typeof props === 'string') {
        props = {
          src: props
        }
      }
      return props
    },
    resolveMediaUris (props) {
      return props.src
    },
    collectPropsMain (props) {
      const asset = this.$store.getters['media/assetByUri'](props.src)
      return { asset }
    }
  }
}
