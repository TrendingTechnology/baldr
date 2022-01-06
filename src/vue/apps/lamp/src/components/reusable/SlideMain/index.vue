<template>
  <!-- v-if: We must have a slide object, else error messages when
       entering are appearing. -->
  <div
    :b-center-vertically="styleConfig.centerVertically"
    :b-content-theme="styleConfig.contentTheme"
    :b-dark-mode="styleConfig.darkMode"
    class="vc_slide_main"
    v-if="slide"
  >
    <master-icon :slide="slide" />
    <meta-data-overlay :slide="slide" />
    <master-renderer
      :slide="slide"
      :slide-ng="slideNg"
      :step-no="stepNo"
      :is-public="isPublic"
    />
    <audio-overlay :slide="slide" :slide-ng="slideNg" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import { Slide as SlideNg } from '@bldr/presentation-parser'

import AudioOverlay from './AudioOverlay.vue'
import MasterIcon from './MasterIcon.vue'
import MasterRenderer from './MasterRenderer.vue'
import MetaDataOverlay from './MetaDataOverlay.vue'

import { Slide } from '../../../content-file.js'

@Component({
  components: {
    AudioOverlay,
    MasterIcon,
    MasterRenderer,
    MetaDataOverlay
  }
})
export default class SlideMain extends Vue {
  /**
   * To be able to show two slide views side by side, for the preview
   * of the next slide / step, we don’t use Vuex getters. We hand down
   * the object `slide` and the number `stepNo` to the main master
   * components.
   */
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

  @Prop({
    type: Number
  })
  stepNo: number

  /**
   * Used in the public sequence of slides, not as a secondary
   * view or a future view.
   */
  @Prop({
    type: Boolean,
    default: true
  })
  isPublic: boolean

  get styleConfig () {
    return this.slide.master.styleConfig
  }
}
</script>

<style lang="scss">
.vc_slide_main {
  overflow-x: hidden;
  position: relative;
}
</style>
