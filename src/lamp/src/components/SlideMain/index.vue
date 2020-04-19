<template>
  <!-- v-if: We must have a slide object, else error messages when
       entering are appearing. -->
  <div
    :b-center-vertically="styleConfig.centerVertically"
    :b-content-theme="styleConfig.contentTheme"
    :b-dark-mode="styleConfig.darkMode"
    class="vc_slide_main"
    v-if="slide"
  >
    <master-icon :slide="slide"/>
    <meta-data-overlay :slide="slide"/>
    <master-renderer :slide="slide" :step-no="stepNo" :is-public="isPublic"/>
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
    },
    // Used in the public sequence of slides, not as a secondary
    // view or a future view.
    isPublic: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    styleConfig () {
      return this.slide.master.styleConfig
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
