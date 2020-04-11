<template>
  <!-- We must have a slide object. Else error messages when entering
       are appearing
  -->
  <div v-if="slide" class="vc_slide_main">
    <master-icon :slide="slide"/>
    <meta-data-overlay :slide="slide"/>
    <master-renderer :slide="slide"/>
    <audio-overlay :slide="slide"/>
  </div>
</template>

<script>
import AudioOverlay from './AudioOverlay.vue'
import MasterIcon from './MasterIcon.vue'
import MasterRenderer from './MasterRenderer.vue'
import MetaDataOverlay from './MetaDataOverlay.vue'

export default {
  name: 'SlideMain',
  props: {
    slide: {
      type: Object,
      required: true
    }
  },
  components: {
    AudioOverlay,
    MasterIcon,
    MasterRenderer,
    MetaDataOverlay
  }
}
</script>

<style lang="scss">
  .vc_slide_main {
    overflow-x: hidden;
  }
</style>
