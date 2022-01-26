<template>
  <div
    class="vc_audio_overlay"
    b-ui-theme="default"
    v-if="audioOverlay"
    v-bind:style="{ background: 'none' }"
  >
    <horizontal-play-buttons :src="audioOverlay" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import { Slide as SlideNg } from '@bldr/presentation-parser'
import { WrappedUriList } from '@bldr/client-media-models'

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

  get audioOverlay (): WrappedUriList | undefined {
    return this.slideNg.audioOverlay
  }
}
</script>

<style lang="scss">
.vc_audio_overlay {
  background-color: none !important;
}
</style>
