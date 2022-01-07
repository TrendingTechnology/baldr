<template>
  <div class="vc_ad_hoc_camera main-app-fullscreen" b-ui-theme="default">
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
export default class AdHocCamera extends Vue {
  data (): {
    slide: Slide
    slideNg: SlideNg
    } {
    const raw = { camera: true }
    return {
      slide: new Slide(raw),
      slideNg: new SlideNg(raw, 1, 1)
    }
  }
}
</script>

<style lang="scss">
.vc_ad_hoc_camera {
  .vc_master_renderer {
    height: 100vh;
  }
}
</style>
