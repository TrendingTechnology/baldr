<template>
  <!-- We must a slide object. Else error messages when entering  -->
  <div v-if="slide" class="vc_slide_view" :style="style">
    <slide-main :slide="slide" :step-no="slide.stepNo"/>
    <cursor-arrows/>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { routerGuards } from '@/routing.js'
import CursorArrows from '@/components/CursorArrows.vue'
import SlideMain from '@/components/SlideMain/index.vue'

const { mapGetters } = createNamespacedHelpers('lamp')

export default {
  name: 'SlideView',
  computed: {
    ...mapGetters(['slide']),
    style () {
      return {
        fontSize: `${this.slide.scaleFactor * 2}vw`
      }
    }
  },
  components: {
    SlideMain,
    CursorArrows
  },
  ...routerGuards
}
</script>

<style lang="scss">
  .vc_slide_view {
    overflow-x: hidden;

    // To get scroll bars on this element, similar to speakers view
    .vc_slide_main {
      height: 100vh;
    }

    .vc_master_renderer {
      height: 100vh;
    }

    .left-bottom-corner, .vc_audio_overlay {
      position: fixed;
      z-index: 1;
      left: 1vmin;
      bottom: 1vmin;
    }

    .vc_play_button {
      font-size: 3vmin;
    }

    .vc_horizontal_play_buttons {
      height: 3vmin;
    }

    // See styling:
    // - components/SlideMain/MasterIcon.vue (Basic styling)
    // - routes/SpeakerView/index.vue (Adjustments for the speaker view)
    // - routes/SlideView/index.vue (Adjustments for the main slide view)
    .vc_master_icon {
      height: 1em;
      left: 1vmin;
      line-height: 1em;
      top: 1vmin;

      &.small {
        font-size: 4vmin;
      }

      &.large {
        font-size: 8vmin;
      }
    }
  }
</style>
