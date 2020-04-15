<template>
  <div class="vc_speaker_view main-app-fullscreen" b-ui-theme="default">
    <h1>Referentenansicht</h1>

    <div class="slide-panel" v-if="presentation && slide">
      <slide-main id="current-slide" :slide="slide" :step-no="currentStepNo"/>
      <slide-main id="next-slide" :slide="nextSlide" :step-no="nextStepNo" :used-in-public="false"/>
    </div>

    <cursor-arrows/>
  </div>
</template>

<script>
import SlideMain from '@/components/SlideMain/index.vue'
import CursorArrows from '@/components/CursorArrows.vue'
import { createNamespacedHelpers } from 'vuex'
import { routerGuards } from '@/lib.js'

const { mapGetters } = createNamespacedHelpers('lamp')

export default {
  name: 'SpeakerView',
  components: {
    SlideMain,
    CursorArrows
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
    currentStepNo () {
      return this.slide.stepNo
    },
    nextStepNo () {
      return this.nextRouterParams.stepNo
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
    padding: 1em;

    .slide-panel {
      display: flex;
      font-size: 0.2vw;
      justify-content: space-between;
      padding: 1em;
    }

    #current-slide {
      font-size: 6em;
    }

    #next-slide {
      font-size: 4em;
    }

    .vc_slide_main {
      border: solid $black 1px;
      height: 30em;
      width: 40em;
    }

    .vc_master_renderer {
      height: 30em;
    }
  }
</style>
