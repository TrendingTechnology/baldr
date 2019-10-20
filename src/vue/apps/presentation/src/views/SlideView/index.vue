<template>
  <div class="vc_slide_view">
    <slide-number/>
    <div class="master-wrapper">
      <master-renderer class="vc_master_renderer"/>
    </div>
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

  }

  [b-center-vertically="true"] {
    .master-wrapper {
      display: table;
      height: 100vh;
      width: 100vw;
    }

    .vc_master_renderer {
      display: table-cell;
      vertical-align: middle;
      height: 100%;
    }
  }
</style>