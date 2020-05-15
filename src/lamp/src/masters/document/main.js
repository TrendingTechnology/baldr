/**
 *
 * @see {@link https://github.com/FranckFreiburger/vue-pdf}
 *
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
    },
    calculateStepCount ({ propsMain }) {
      const asset = propsMain.asset
      if (asset.pageCount && asset.pageCount > 1) {
        return asset.pageCount
      }
    },
    titleFromProps ({ propsMain }) {
      if (propsMain.asset.title) return propsMain.asset.title
    },
    afterStepNoChangeOnComponent () {
      if (this.$refs.pdfViewer) {
        const pdf = this.$refs.pdfViewer.$el
        const parentHeight = this.$parent.$parent.$el.clientHeight
        this.$nextTick(() => {
          const width = pdf.clientWidth / pdf.clientHeight * parentHeight
          if (width <= this.$el.clientWidth) {
            pdf.style.width = `${width}px`
          }
        })
      }
    }
  }
}
