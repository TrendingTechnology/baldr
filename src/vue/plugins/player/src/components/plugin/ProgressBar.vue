<template>
  <div class="vc_progress_bar" ref="progress">
    <div ref="elapsed" class="elapsed" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from '@bldr/vue-packages-bundler'

import { player } from '../../plugin'
import { Playable } from '../../playable'

@Component
export default class ProgressBar extends Vue {
  @Prop()
  playable!: Playable

  $refs!: {
    progress: HTMLElement
    elapsed: HTMLElement
  }

  updateProgress () {
    if (this.$refs.elapsed == null) {
      return
    }
    this.$refs.elapsed.style.width = `${this.playable.progress * 100}%`
  }

  seek (event: MouseEvent) {
    console.log(event.offsetX / this.$refs.progress.clientWidth)
  }

  registerEvents (): void {
    if (this.playable != null) {
      this.$refs.progress.addEventListener('click', this.seek)
      this.playable.registerTimeUpdateListener(this.updateProgress)
    }
  }

  unregisterEvents (): void {
    this.$refs.progress.removeEventListener('click', this.seek)
    this.playable.removeEventsListener(this.updateProgress)
  }

  mounted (): void {
    this.registerEvents()
  }

  @Watch('playable')
  onPlayableChange (): void {
    this.registerEvents()
  }

  beforeDestroy () {
    this.unregisterEvents()
  }
}
</script>

<style lang="scss">
.vc_progress_bar {
  background-color: $black;
  height: 0.2em;
  width: 100%;

  .elapsed {
    background: $orange;
    width: 0%;
    height: 100%;
  }
}
</style>
