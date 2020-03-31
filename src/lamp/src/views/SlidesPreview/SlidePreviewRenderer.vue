<script>
export default {
  name: 'SlidePreviewRenderer',
  props: {
    slide: {
      type: Object
    }
  },
  render: function (createElement) {
    if (this.slide) {
      if (this.slide.renderData.propsPreview) {
        return createElement(
          `${this.slide.master.name}-master-preview`,
          {
            props: this.slide.renderData.propsPreview,
          }
        )
      } else {
        return createElement('div', {
          domProps: {
            innerHTML: this.slide.plainText
          },
        })
      }
    }
  }
}
</script>
