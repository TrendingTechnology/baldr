<template>
  <div class="vc_video_screen">
    <div ref="screenContainer" />
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'

import PlayableBase from './PlayableBase.vue'

@Component
export default class VideoScreen extends PlayableBase {
  $refs!: {
    screenContainer: HTMLDivElement
  }

  registerEvents () {
    if (this.playable == null) {
      return
    }
    this.$refs.screenContainer.appendChild(this.playable.htmlElement)
  }
}
</script>
