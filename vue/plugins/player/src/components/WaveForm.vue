<template>
  <div class="vc_wave_form" v-if="asset != null && asset.waveformHttpUrl">
    <img ref="waveformImage" :src="asset.waveformHttpUrl" />
    <div ref="progressOverlay" class="progress-indicator-overlay" />
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'

import PlayableBase from './PlayableBase.vue'

@Component
export default class WaveForm extends PlayableBase {
  $refs!: {
    progressOverlay: HTMLElement
    waveformImage: HTMLElement
  }

  private updateProgress (): void {
    if (this.$refs.waveformImage == null) {
      return
    }
    const div = this.$refs.progressOverlay

    const img = this.$refs.waveformImage
    const height = img.clientHeight
    const width = img.clientWidth

    div.style.height = `${height}px`
    div.style.width = `${this.playable.progress * width}px`
    div.style.marginLeft = `${img.offsetLeft}px`
    div.style.marginTop = `${img.offsetTop}px`
  }

  private seek (event: MouseEvent): void {
    if (this.playable != null) {
      this.playable.progress =
        event.offsetX / this.$refs.waveformImage.clientWidth
    }
  }

  private resetProgress (): void {
    if (this.$refs.progressOverlay == null) {
      return
    }
    this.$refs.progressOverlay.style.width = '0px'
  }

  /**
   * @override
   */
  playableConnected (): void {
    this.$nextTick(() => {
      if (this.$refs.waveformImage != null) {
        this.$refs.waveformImage.addEventListener('click', this.seek)
      }
    })

    if (this.playable != null) {
      this.playable.registerTimeUpdateListener(this.updateProgress)
    }
  }

  /**
   * @override
   */
  playableDisconnected (): void {
    this.resetProgress()

    if (this.$refs.waveformImage != null) {
      this.$refs.waveformImage.removeEventListener('click', this.seek)
    }
    if (this.playable != null) {
      this.playable.removeEventsListener(this.updateProgress)
    }
  }
}
</script>

<style lang="scss">
.vc_wave_form {
  position: relative;
  padding: 1em;

  img {
    filter: invert(100%);
    opacity: 0.4;
    height: 10vw;
    width: 100%;
    position: relative;
    cursor: pointer;
  }

  .progress-indicator-overlay {
    background-color: $blue;
    border-right: 1px solid darken($blue, 40%);
    height: 0;
    left: 0;
    opacity: 0.2;
    pointer-events: none;
    position: absolute;
    top: 0;
    width: 0;
  }
}
</style>
