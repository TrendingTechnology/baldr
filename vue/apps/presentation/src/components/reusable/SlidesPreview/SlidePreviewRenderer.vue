<script lang="ts">
import Vue, { VNode, CreateElement } from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import { Slide as SlideNg } from '@bldr/presentation-parser'

import { Slide } from '../../../content-file.js'

@Component
export default class SlidePreviewRenderer extends Vue {
  @Prop({
    type: Object,
    required: true
  })
  slide: Slide

  @Prop({
    type: Object,
    required: true
  })
  slideNg: SlideNg

  render (createElement: CreateElement): VNode {
    if (this.slide && this.slide.propsPreview) {
      const props = {
        slide: this.slide,
        slideNg: this.slideNg,
        ...this.slide.propsPreview
      }
      return createElement(`${this.slide.master.name}-master-preview`, {
        props,
        style: this.slideNg.cssStyle,
        attrs: {
          id: `slide-preview_no-${this.slideNg.no}`
        }
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
