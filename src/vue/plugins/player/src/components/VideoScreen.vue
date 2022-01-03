<template>
  <div class="vc_video_screen">
    <div ref="screenContainer" />
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'

import PlayableBaseNg from './PlayableBaseNg.vue'

@Component
export default class VideoScreen extends PlayableBaseNg {
  $refs!: {
    screenContainer: HTMLDivElement
  }

  /**
   * @override
   */
  playableConnected () {
    this.$refs.screenContainer.appendChild(this.playable.htmlElement)
  }

  /**
   * @override
   */
  playableDisconnected () {
    this.$refs.screenContainer.innerHTML = ''
  }
}
</script>
