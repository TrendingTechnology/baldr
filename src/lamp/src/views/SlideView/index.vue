<template>
  <div class="vc_slide_view">
    <master-icon/>
    <meta-data-overlay/>
    <master-renderer/>
    <audio-overlay/>
    <cursor-arrows/>
  </div>
</template>

<script>
import AudioOverlay from './AudioOverlay.vue'
import MasterIcon from './MasterIcon.vue'
import MasterRenderer from './MasterRenderer.vue'
import MetaDataOverlay from './MetaDataOverlay.vue'
import CursorArrows from './CursorArrows.vue'
import { routerGuards } from '@/lib.js'

export default {
  name: 'SlideView',
  components: {
    AudioOverlay,
    MasterIcon,
    MasterRenderer,
    MetaDataOverlay,
    CursorArrows
  },
  ...routerGuards
}
</script>

<style lang="scss">
  .vc_slide_view {
    overflow-x: hidden;
  }
</style>
