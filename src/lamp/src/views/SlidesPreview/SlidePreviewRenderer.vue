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
      if (this.slide.propsPreview) {
        return createElement(
          `${this.slide.master.name}-master-preview`,
          {
            props: this.slide.propsPreview,
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
