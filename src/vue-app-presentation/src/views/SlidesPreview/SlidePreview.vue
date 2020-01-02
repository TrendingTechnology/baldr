<script>
export default {
  name: 'SlidePreview',
  props: {
    slide: {
      type: Object
    }
  },
  render: function (createElement) {
    if (this.slide) {
      return createElement(
        'div',
        {
          attrs: {
            'b-content-theme': this.slide.master.contentTheme
          },
          class: {
            'vc_slide_preview': true,
          }
        },
        [
          createElement(
            `${this.slide.master.name}-master`,
            {
              props: this.slide.renderData.props,
              class: {
                'master-inner': true
              },
              style: this.slide.styleInline
            }
          )
        ]
      )
    }
  }
}
</script>
