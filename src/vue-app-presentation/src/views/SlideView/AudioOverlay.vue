<template>
  <div class="vc_audio_overlay" b-ui-theme="default" v-if="slideCurrent.audioOverlay">
    <horizontal-play-buttons
      :samples="slideCurrent.audioOverlay.samples"
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
  }
}
</script>

<style lang="scss" scoped>
  .vc_audio_overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    .vc_play_button {
      font-size: 2em;
    }
  }
</style>
