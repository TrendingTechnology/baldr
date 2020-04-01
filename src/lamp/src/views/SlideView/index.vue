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

export default {
  name: 'SlideView',
  components: {
    AudioOverlay,
    MasterIcon,
    MasterRenderer,
    MetaDataOverlay,
    SlideNumber
  },
  async mounted () {
    if (this.$route.name === 'open-by-pres') {
      //openPresentation(this.$route.params.presId)
      //await this.$store.dispatch('presentation/openPresentationById', this.$route.params.presId)
    } else if (this.$route.name === 'open-by-pres-slide') {
      openPresentation(this.$route.params.presId, this.$route.params.slideNo)
    } else if (this.$route.name === 'open-by-pres-slide-step') {
      openPresentation(this.$route.params.presId, this.$route.params.slideNo, this.$route.params.stepNo)
    }
  }
}
</script>

<style lang="scss">
  .vc_slide_view {
    overflow-x: hidden;
  }
</style>
