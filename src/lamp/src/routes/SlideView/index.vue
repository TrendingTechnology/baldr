<template>
  <!-- We must a slide object. Else error messages when entering  -->
  <div v-if="slide" class="vc_slide_view" :style="style">
    <slide-main :slide="slide" :step-no="slide.stepNo"/>
    <cursor-arrows/>
  </div>
</template>

<script>
import SlideMain from '@/components/SlideMain/index.vue'
import CursorArrows from '@/components/CursorArrows.vue'
import { routerGuards } from '@/lib.js'
import { createNamespacedHelpers } from 'vuex'

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

    .vc_master_renderer {
      height: 100vh;
    }

    .vc_play_button {
      position: fixed;
      font-size: 3vmin;
      z-index: 1;
      left: 1vmin;
      bottom: 1vmin;
    }

    .vc_master_icon {
      left: 0.2vmin;
      top: 0.1vmin;

      &.small {
        font-size: 4vmin;
      }

      &.large {
        font-size: 8vmin;
      }
    }
  }
</style>
