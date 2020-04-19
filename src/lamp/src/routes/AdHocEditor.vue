<template>
  <div class="vc_ad_hoc_editor main-app-fullscreen" b-ui-theme="default">
    <slide-main :slide="slide" :is-public="false"/>
  </div>
</template>

<script>
import SlideMain from '@/components/SlideMain/index.vue'
import { Slide } from '@/content-file.js'

export default {
  name: 'AdHocEditor',
  components: {
    SlideMain
  },
  data () {
    return {
      slide: new Slide({ editor: true })
    }
  }
}
</script>

<style lang="scss">
  .vc_ad_hoc_editor {
    .vc_master_renderer {
      height: 100vh;
    }
  }
</style>
