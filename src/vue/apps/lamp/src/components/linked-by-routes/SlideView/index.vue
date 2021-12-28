<!--
  routes:
  - /presentation/:presRef/slide/:slideNo
  - /presentation/:presRef/slide/:slideNo/step/:stepNo
-->
<template>
  <!-- The slide object must exist, else error messages when entering -->
  <div v-if="slide" class="vc_slide_view" :style="style">
    <slide-main :slide="slide" :step-no="slide.stepNo" />
    <cursor-arrows />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { createNamespacedHelpers } from 'vuex'

import { Slide } from '@bldr/presentation-parser'

import { routerGuards } from '@/routing'
import CursorArrows from '@/components/reusable/CursorArrows.vue'
import SlideMain from '@/components/reusable/SlideMain/index.vue'

const { mapGetters } = createNamespacedHelpers('lamp')

@Component({
  computed: mapGetters(['slide', 'slideNg']),
  components: {
    SlideMain,
    CursorArrows
  },
  ...routerGuards
})
export default class SlideView extends Vue {
  slide!: any

  slideNg!: Slide

  get style (): { fontSize: string } {
    return {
      fontSize: `${this.slideNg.scaleFactor * 2}vw`
    }
  }
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

  .left-bottom-corner,
  .vc_audio_overlay {
    position: fixed;
    z-index: 1;
    left: 1vw;
    bottom: 1vw;
  }

  // src/media-client/src/PlayButton.vue
  .vc_play_button {
    font-size: 2vw;
  }

  // src/media-client/src/HorizontalPlayButtons.vue
  .vc_horizontal_play_buttons {
    height: 2vw;

    .manual-title {
      font-size: 1.5vw;
      padding: 0 0.5vw;
      transform: translateY(-0.5vw);
    }
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
