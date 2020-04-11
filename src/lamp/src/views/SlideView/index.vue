<template>
  <!-- We must a slide object. Else error messages when entering

   -->
  <div v-if="slide" class="vc_slide_view">
    <master-icon :slide="slide"/>
    <meta-data-overlay :slide="slide"/>
    <master-renderer :slide="slide"/>
    <audio-overlay :slide="slide"/>
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
import { createNamespacedHelpers } from 'vuex'

const { mapGetters } = createNamespacedHelpers('lamp')

export default {
  name: 'SlideView',
  components: {
    AudioOverlay,
    MasterIcon,
    MasterRenderer,
    MetaDataOverlay,
    CursorArrows
  },
  computed: mapGetters(['slide']),
  ...routerGuards
}
</script>

<style lang="scss">
  .vc_slide_view {
    overflow-x: hidden;
  }
</style>
