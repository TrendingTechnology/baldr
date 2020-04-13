<template>
  <!-- v-if: We must have a slide object, else error messages when
       entering are appearing. -->
  <div v-if="slide" class="vc_slide_main" :b-dark-mode="darkMode" :b-content-theme="contentTheme">
    <master-icon :slide="slide"/>
    <meta-data-overlay :slide="slide"/>
    <master-renderer :slide="slide" :step-no="stepNo"/>
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
    // To be able to show two slide views side by side, for the preview
    // of the next slide / step, we don’t use Vuex getters. We hand down
    // the object `slide` and the number `stepNo` to the main master
    // components.
    slide: {
      type: Object,
      required: true
    },
    stepNo: {
      type: Number
    }
  },
  computed: {
    contentTheme () {
      return this.slide.master.styleConfig.contentTheme
    },
    darkMode () {
      return this.slide.master.styleConfig.darkMode
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
    position: relative;
    min-height: 100%;
  }
</style>
