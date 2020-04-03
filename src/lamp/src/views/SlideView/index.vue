<template>
  <div class="vc_slide_view">
    <master-icon/>
    <slide-number/>
    <meta-data-overlay/>
    <master-renderer/>
    <audio-overlay/>
  </div>
</template>

<script>
import AudioOverlay from './AudioOverlay.vue'
import MasterIcon from './MasterIcon.vue'
import MasterRenderer from './MasterRenderer.vue'
import MetaDataOverlay from './MetaDataOverlay.vue'
import SlideNumber from './SlideNumber.vue'
import { openPresentation } from '@/lib.js'

import store from '@/store.js'

const routeNames = ['open-by-pres', 'open-by-slide', 'open-by-step']

export default {
  name: 'SlideView',
  components: {
    AudioOverlay,
    MasterIcon,
    MasterRenderer,
    MetaDataOverlay,
    SlideNumber
  }
}
</script>

<style lang="scss">
  .vc_slide_view {
    overflow-x: hidden;
  }
</style>
