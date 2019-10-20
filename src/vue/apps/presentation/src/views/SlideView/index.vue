<template>
  <div class="vc_slide_view">
    <slide-number/>
    <master-renderer/>
  </div>
</template>

<script>
import MasterRenderer from './MasterRenderer.vue'
import SlideNumber from './SlideNumber.vue'

export default {
  name: 'SlideView',
  components: {
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
