<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

@Component
export default class SlidePreviewRenderer extends Vue {
  @Prop({
    type: Object
  })
  slide: any

  render (createElement) {
    if (this.slide && this.slide.propsPreview) {
      return createElement(`${this.slide.master.name}-master-preview`, {
        props: this.slide.propsPreview,
        style: this.slide.style
      })
    } else {
      return createElement('div', {
        domProps: {
          innerHTML: this.slide.plainText
        }
      })
    }
  }
}
</script>
