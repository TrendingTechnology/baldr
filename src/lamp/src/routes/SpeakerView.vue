<template>
  <div class="vc_speaker_view main-app-fullscreen main-app-padding" b-ui-theme="default">
    <h1>Referentenansicht</h1>

    <div class="slide-panel" v-if="presentation">
      <slide-main id="current-slide" :slide="slide"/>
      <slide-main id="next-slide" :slide="nextSlide" :step-no="nextStepNo"/>
    </div>
  </div>
</template>

<script>
import SlideMain from '@/components/SlideMain/index.vue'
import { createNamespacedHelpers } from 'vuex'
import { routerGuards } from '@/lib.js'

const { mapGetters } = createNamespacedHelpers('lamp')

export default {
  name: 'SpeakerView',
  components: {
    SlideMain
  },
  computed: {
    ...mapGetters(['slide', 'presentation', 'slides']),
    nextRouterParams () {
      return this.presentation.navigator.getNextRouterParams(1)
    },
    nextSlide () {
      const params = this.nextRouterParams
      return this.slides[params.slideNo - 1]
    },
    nextStepNo () {
      const stepNo = this.nextRouterParams.stepNo
      if (stepNo && stepNo > 1) return stepNo
      return 0
    }
  },
  methods: {
    sendMessage () {
      this.$socket.sendObj({ presId: 'Futurismus' })
    }
  },
  ...routerGuards
}
</script>

<style lang="scss">
  .vc_speaker_view {
    .slide-panel {
      display: flex;
      font-size: 0.2vw;
      justify-content: space-between;
      padding: 4em;
    }

    #current-slide {
      font-size: 6em;
    }

    #next-slide {
      font-size: 4em;
    }

    .vc_slide_main {
      border: solid $black 1px;
      width: 40em;
      height: 30em;
    }
  }
</style>
