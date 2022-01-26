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
    <slide-preview-renderer :slide="slide" :slide-ng="slideNg" />
    <div class="audio-overlay-indicator-icons" v-if="audioOverlayCount > 0">
      <plain-icon name="player-play" v-for="n in audioOverlayCount" :key="n" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import { Slide as SlideNg } from '@bldr/presentation-parser'

import { getViewFromRoute } from '../../../lib/routing-related'
import { Slide } from '../../../content-file.js'

import SlidePreviewRenderer from './SlidePreviewRenderer.vue'

@Component({
  components: {
    SlidePreviewRenderer
  }
})
export default class SlidePreview extends Vue {
  @Prop({
    type: Object,
    required: true
  })
  slide!: Slide

  @Prop({
    type: Object,
    required: true
  })
  slideNg!: SlideNg

  get slideCurrent (): Slide {
    return this.$store.getters['presentation/slide']
  }

  gotToSlide (slide: Slide): void {
    const location = slide.routerLocation(getViewFromRoute())
    this.$router.push(location)
  }

  get audioOverlayCount (): number | undefined {
    return this.slideNg.audioOverlay?.size
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
    font-size: 4em;
    position: absolute;
    right: 0.1em;
    text-shadow: 0 0 0.5em rgba($black, 0.6);
    top: 0.1em;
    z-index: 1;
  }

  .audio-overlay-indicator-icons {
    position: absolute;
    bottom: 0;
    left: 0;
  }
}
</style>
