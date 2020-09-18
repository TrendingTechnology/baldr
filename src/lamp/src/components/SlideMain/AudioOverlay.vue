<template>
  <div class="vc_audio_overlay" b-ui-theme="default" v-if="audioOverlay">
    <horizontal-play-buttons
      :wrapped-samples="audioOverlay.wrappedSampleList"
      :show-titles="audioOverlay.showTitles"
    />
  </div>
</template>

<script>
export default {
  name: 'AudioOverlay',
  props: {
    slide: {
      type: Object,
      required: true
    }
  },
  computed: {
    audioOverlay () {
      if (this.slide && this.slide.audioOverlay) {
        return this.slide.audioOverlay
      }
      return ''
    }
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
