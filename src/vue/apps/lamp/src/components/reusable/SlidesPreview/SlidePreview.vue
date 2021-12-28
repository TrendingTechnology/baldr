<template>
  <div
    class="vc_slide_preview"
    @click="gotToSlide(slide)"
    :class="{ 'current-slide': slideCurrent && slideCurrent.no === slide.no }"
    :b-dark-mode="slide.master.styleConfig.darkMode"
  >
    <color-icon
      class="preview-master-icon"
      v-if="slide.master.icon.showOnSlides"
      :name="slide.master.icon.name"
      :color="slide.master.icon.color"
    />
    <slide-preview-renderer :slide="slide" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import SlidePreviewRenderer from './SlidePreviewRenderer.vue'
import { getViewFromRoute } from '../../../lib/routing-related'

@Component({
  components: {
    SlidePreviewRenderer
  }
})
export default class SlidePreview extends Vue {
  @Prop({
    type: Object
  })
  slide: any

  get slideCurrent () {
    return this.$store.getters['lamp/slide']
  }

  gotToSlide (slide) {
    const location = slide.routerLocation(getViewFromRoute())
    this.$router.push(location)
  }
}
</script>

<style lang="scss">
.vc_slide_preview {
  border: 1px solid $gray;
  cursor: pointer;
  height: 15em;
  margin: 0em;
  min-height: 15em;
  min-width: 20em;
  overflow: hidden;
  position: relative;
  width: 20em;

  &[b-dark-mode='true'] {
    background-color: $black;
    color: $white;
  }

  &[b-dark-mode='false'] {
    background-color: $white;
    color: $black;
  }

  &::before {
    content: '';
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

  .preview-master-icon {
    font-size: 3em;
    left: 0.1em;
    position: absolute;
    top: 0.1em;
    z-index: 1;
  }
}
</style>
