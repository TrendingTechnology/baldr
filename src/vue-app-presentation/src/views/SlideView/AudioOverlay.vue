<template>
  <div class="vc_audio_overlay" b-ui-theme="default" v-if="audioOverlay">
    <horizontal-play-buttons
      :wrapped-samples="audioOverlay.wrappedSamples"
      :show-titles="audioOverlay.showTitles"
    />
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('presentation')

export default {
  name: 'AudioOverlay',
  computed: {
    ...mapGetters(['slideCurrent']),
    audioOverlay () {
      if (this.slideCurrent && this.slideCurrent.audioOverlay) {
        return this.slideCurrent.audioOverlay
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .vc_audio_overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    background: none !important;

    .vc_play_button {
      font-size: 2em;
    }
  }
</style>
