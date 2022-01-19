<template>
  <!-- vc_slide_view to get correct sizes of the master icon -->
  <div
    class="vc_ad_hoc_editor vc_slide_view main-app-fullscreen"
    b-ui-theme="default"
  >
    <slide-main :slide="slide" :slide-ng="slideNg" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

import { Slide as SlideNg } from '@bldr/presentation-parser'

import SlideMain from '@/components/reusable/SlideMain/index.vue'
import { Slide } from '../../content-file.js'

@Component({
  components: {
    SlideMain
  }
})
export default class AdHocEditor extends Vue {
  slide: Slide

  slideNg: SlideNg

  data (): {
    slide: Slide
    slideNg: SlideNg
    } {
    const raw = { editor: { markup: 'Hefteintrag' } }
    return {
      slide: new Slide(raw),
      slideNg: new SlideNg(raw, 1, 1)
    }
  }
}
</script>

<style lang="scss">
.vc_ad_hoc_editor {
  .vc_master_renderer {
    height: 100vh;
    font-size: 3.5em;
  }
}
</style>
