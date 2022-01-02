<template>
  <div class="vc_ad_hoc_camera main-app-fullscreen" b-ui-theme="default">
    <slide-main :slide="slide" :is-public="false" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

import SlideMain from '@/components/reusable/SlideMain/index.vue'
import { Slide } from '../../content-file.js'

@Component({
  components: {
    SlideMain
  }
})
export default class AdHocCamera extends Vue {
  data () {
    return {
      slide: new Slide({ camera: true })
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
