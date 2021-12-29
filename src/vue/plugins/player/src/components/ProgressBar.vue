<template>
  <div class="vc_progress_bar" ref="progress">
    <div ref="elapsed" class="elapsed" />
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'

import PlayableBase from './PlayableBase.vue'

@Component
export default class ProgressBar extends PlayableBase {
  $refs!: {
    progress: HTMLElement
    elapsed: HTMLElement
  }

  updateProgress () {
    if (this.$refs.elapsed == null || this.playable == null) {
      return
    }
    this.$refs.elapsed.style.width = `${this.playable.progress * 100}%`
  }

  seek (event: MouseEvent) {
    if (this.playable != null) {
      this.playable.progress = event.offsetX / this.$refs.progress.clientWidth
    }
  }

  registerEvents (): void {
    this.$refs.progress.addEventListener('click', this.seek)
    if (this.playable != null) {
      this.playable.registerTimeUpdateListener(this.updateProgress)
    }
  }

  unregisterEvents (): void {
    this.$refs.progress.removeEventListener('click', this.seek)
    if (this.playable != null) {
      this.playable.removeEventsListener(this.updateProgress)
    }
  }
}
</script>

<style lang="scss">
.vc_progress_bar {
  background-color: $black;
  height: 0.2em;
  width: 100%;
  cursor: pointer;

  .elapsed {
    background: $orange;
    width: 0%;
    height: 100%;
  }
}
</style>
