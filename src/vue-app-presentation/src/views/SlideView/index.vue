<template>
  <div class="vc_slide_view">
    <master-icon/>
    <slide-number/>
    <master-renderer/>
    <audio-overlay/>
  </div>
</template>

<script>
import AudioOverlay from './AudioOverlay.vue'
import MasterIcon from './MasterIcon.vue'
import MasterRenderer from './MasterRenderer.vue'
import SlideNumber from './SlideNumber.vue'

export default {
  name: 'SlideView',
  components: {
    AudioOverlay,
    MasterIcon,
    MasterRenderer,
    SlideNumber
  }
}
</script>

<style lang="scss" scoped>
  .vc_slide_view {
    overflow-x: hidden;
  }
</style>
