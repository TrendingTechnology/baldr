<template>
  <!-- We must a slide object. Else error messages when entering  -->
  <div v-if="slide" class="vc_slide_view">
    <slide-main :slide="slide" :step-no="stepNo"/>
    <cursor-arrows/>
  </div>
</template>

<script>
import SlideMain from '@/components/SlideMain/index.vue'
import CursorArrows from './CursorArrows.vue'
import { routerGuards } from '@/lib.js'
import { createNamespacedHelpers } from 'vuex'

const { mapGetters } = createNamespacedHelpers('lamp')

export default {
  name: 'SlideView',
  computed: {
    ...mapGetters(['slide']),
    stepNo () {
      if (this.slide.stepNo) return this.slide.stepNo
      return 0
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
  }
</style>
