<template>
  <div class="vc_ad_hoc_editor main-app-fullscreen" b-ui-theme="default">
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
export default class AdHocEditor extends Vue {
  data () {
    return {
      slide: new Slide({ editor: { markup: 'Hefteintrag' } })
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
