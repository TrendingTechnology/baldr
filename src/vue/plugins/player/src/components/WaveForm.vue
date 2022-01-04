<template>
  <div class="vc_wave_form" v-if="asset != null && asset.waveformHttpUrl">
    <img ref="waveformImg" :src="asset.waveformHttpUrl" />
    <div ref="progressIndicatorOverlayDiv" class="progress-indicator-overlay" />
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'

import PlayableBase from './PlayableBase.vue'

@Component
export default class WaveForm extends PlayableBase {
  $refs!: {
    progressIndicatorOverlayDiv: HTMLElement
    waveformImg: HTMLElement
  }

  private updateProgress (): void {
    if (this.$refs.waveformImg == null) {
      return
    }
    const div = this.$refs.progressIndicatorOverlayDiv

    const img = this.$refs.waveformImg
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
        event.offsetX / this.$refs.waveformImg.clientWidth
    }
  }

  /**
   * @override
   */
  playableConnected (): void {
    this.$nextTick(() => {
      if (this.$refs.waveformImg != null) {
        this.$refs.waveformImg.addEventListener('click', this.seek)
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
    if (this.$refs.waveformImg != null) {
      this.$refs.waveformImg.removeEventListener('click', this.seek)
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
    height: 0;
    left: 0;
    opacity: 0.2;
    position: absolute;
    top: 0;
    width: 0;
    pointer-events: none;
  }
}
</style>
