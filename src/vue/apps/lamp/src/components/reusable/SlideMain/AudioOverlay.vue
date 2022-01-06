<template>
  <div class="vc_audio_overlay" b-ui-theme="default" v-if="audioOverlay">
    <horizontal-play-buttons
      :src="audioOverlay.rawData"
      :show-titles="audioOverlay.showTitles"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import { Slide as SlideNg } from '@bldr/presentation-parser'

import { Slide } from '../../../content-file.js'


@Component
export default class AudioOverlay extends Vue {
  @Prop({
    type: Object,
    required: true
  })
  slide: Slide

  @Prop({
    type: Object,
    required: true
  })
  slideNg: SlideNg

  get audioOverlay () {
    if (this.slide && this.slide.audioOverlay) {
      return this.slide.audioOverlay
    }
    return false
  }
}
</script>

<style lang="scss">
.vc_audio_overlay {
  position: fixed;
  bottom: 0;
  left: 0;
  background: none !important;

  .vc_play_button {
    font-size: 1.5em;
  }
}
</style>
