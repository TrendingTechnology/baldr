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
    const progress = this.$refs.progressOverlay

    const waveform = this.$refs.waveformImage
    const height = waveform.clientHeight
    const width = waveform.clientWidth

    progress.style.height = `${height}px`
    progress.style.width = `${this.playable.progressComplete * width}px`
    progress.style.marginLeft = `${waveform.offsetLeft}px`
    progress.style.marginTop = `${waveform.offsetTop}px`
  }

  private seek (event: MouseEvent): void {
    const progress = event.offsetX / this.$refs.waveformImage.clientWidth
    if (!this.playable.isPlaying) {
      this.playable.player.start({ startProgress: progress })
    }
    if (this.playable != null) {
      this.playable.progress = progress
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
    window.addEventListener('resize', this.updateProgress)

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
    window.removeEventListener('resize', this.updateProgress)

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
