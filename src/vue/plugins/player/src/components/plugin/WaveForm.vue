<template>
  <div class="vc_wave_form" v-if="asset != null && asset.waveformHttpUrl">
    <img ref="waveformImg" :src="asset.waveformHttpUrl" />
    <div ref="progressIndicatorOverlayDiv" class="progress-indicator-overlay" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from '@bldr/vue-packages-bundler'
import { Asset } from '@bldr/media-resolver-ng'
import { Playable } from '../../playable'

@Component
export default class WaveForm extends Vue {
  @Prop()
  playable!: Playable

  $refs!: {
    progressIndicatorOverlayDiv: HTMLElement
    waveformImg: HTMLElement
  }

  get asset (): Asset | undefined {
    if (this.playable != null) {
      return this.playable.sample.asset
    }
  }

  updateProgress () {
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

  seek (event: MouseEvent) {
    if (this.playable != null) {
      this.playable.progress =
        event.offsetX / this.$refs.waveformImg.clientWidth
    }
  }

  registerEvents () {
    this.$nextTick(() => {
      if (this.$refs.waveformImg != null) {
        this.$refs.waveformImg.addEventListener('click', this.seek)
      }
    })

    if (this.playable != null) {
      this.playable.registerTimeUpdateListener(this.updateProgress)
    }
  }

  unregisterEvents (): void {
    if (this.$refs.waveformImg != null) {
      this.$refs.waveformImg.removeEventListener('click', this.seek)
    }
    if (this.playable != null) {
      this.playable.removeEventsListener(this.updateProgress)
    }
  }

  mounted (): void {
    this.registerEvents()
  }

  @Watch('playable')
  onPlayableChange (): void {
    this.unregisterEvents()
    this.registerEvents()
  }

  beforeDestroy () {
    this.unregisterEvents()
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
