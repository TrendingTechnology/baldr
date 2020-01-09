<template>
  <div
    class="vc_slide_preview"
    @click="gotToSlide(slide.no)"
    :class="{ 'current-slide': slideCurrent.no === slide.no }"
  >
    <material-icon
      v-if="slide.master.icon.showOnSlides"
      :name="slide.master.icon.name"
      :color="slide.master.icon.color"
    />
    <slide-preview-renderer :slide="slide"/>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('presentation')

import SlidePreviewRenderer from './SlidePreviewRenderer.vue'

export default {
  name: 'SlidePreview',
  props: {
    slide: {
      type: Object
    }
  },
  components: {
    SlidePreviewRenderer
  },
  computed: mapGetters([
    'slideCurrent'
  ]),
  methods: {
    gotToSlide (slideNo) {
      this.$store.dispatch('presentation/setSlideNoCurrent', slideNo)
      if (this.$route.name !== 'slides') this.$router.push({ name: 'slides' })
    }
  }
}
</script>

<style lang="scss" scoped>
  .vc_slide_preview {
    background-color: $black;
    border: 1px solid $gray;
    color: $white;
    cursor: pointer;
    height: 15em;
    margin: 0em;
    min-height: 15em;
    min-width: 20em;
    overflow: hidden;
    position: relative;
    width: 20em;

    &::before {
      content: "";
      background-color: $gray;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0em;
      left: 0em;
      z-index: 2;
      opacity: 0;
    }

    &:hover::before {
      opacity: 0.3;
    }

    &.current-slide {
      border: 1px solid $red;
    }

    &.current-slide::before {
      background-color: yellow;
      opacity: 0.3;
    }

    .baldr-icon {
      font-size: 3em;
      left: 0.1em;
      position: absolute;
      top: 0.1em;
    }
  }
</style>
