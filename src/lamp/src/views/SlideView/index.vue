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
  },
  beforeRouteEnter (to, from, next) {
    // called before the route that renders this component is confirmed.
    // does NOT have access to `this` component instance,
    // because it has not been created yet when this guard is called!
    next(vm => {
      if (routeNames.includes(to.name) && to.params.presId) {
        vm.$openPresentation({
          presId: to.params.presId,
          slideNo: to.params.slideNo,
          stepNo: to.params.stepNo,
          noRouting: true
        })
      }
    })
  },
  beforeRouteUpdate (to, from, next) {
    if (routeNames.includes(to.name) && to.params.presId) {
      const presentation = store.getters['presentation/presentation']
      if (presentation.id) {
        store.dispatch('presentation/setSlideAndStepNoCurrent', to.params)
        next()
      } else {
        this.$openPresentation({
          presId: to.params.presId,
          slideNo: to.params.slideNo,
          stepNo: to.params.stepNo,
          noRouting: true
        })
      }
    }
  }
}
</script>

<style lang="scss">
  .vc_slide_view {
    overflow-x: hidden;
  }
</style>
