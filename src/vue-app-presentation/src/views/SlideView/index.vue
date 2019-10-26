<template>
  <div class="vc_slide_view">
    <master-icon/>
    <slide-number/>
    <master-renderer/>
  </div>
</template>

<script>
import MasterRenderer from './MasterRenderer.vue'
import SlideNumber from './SlideNumber.vue'
import MasterIcon from './MasterIcon.vue'

export default {
  name: 'SlideView',
  components: {
    MasterRenderer,
    SlideNumber,
    MasterIcon
  }
}
</script>

<style lang="scss" scoped>
  .vc_slide_view {
    overflow-x: hidden;
  }
</style>
