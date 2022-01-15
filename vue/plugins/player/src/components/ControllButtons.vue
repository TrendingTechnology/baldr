<template>
  <div class="vc_controll_buttons">
    <clickable-icon
      name="player-backward"
      :disabled="isBackwardDisabled"
      @click.native="backward()"
    />

    <clickable-icon
      name="player-play"
      :disabled="isPlayDisabled"
      @click.native="play()"
    />

    <clickable-icon
      name="player-replay"
      :disabled="isStartDisabled"
      @click.native="start()"
    />

    <clickable-icon
      name="player-stop"
      :disabled="isStopDisabled"
      @click.native="stop()"
    />

    <clickable-icon
      name="player-pause"
      :disabled="isPauseDisabled"
      @click.native="pause()"
    />

    <clickable-icon
      name="player-forward"
      @click.native="forward()"
      :disabled="isForwardDisabled"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

import { ClickableIcon } from '@bldr/icons'

import { Playable, player } from '../plugin'

@Component({
  components: {
    ClickableIcon
  }
})
export default class ControllButtons extends Vue {
  enqueuedUri?: string
  loadedUri?: string

  data () {
    return player.data
  }

  private get isEnqueued (): boolean {
    return this.enqueuedUri != null
  }

  private get isLoadedPlaying (): boolean {
    return this.loaded != null && this.loaded.isPlaying
  }

  private get loaded (): Playable | undefined {
    if (this.loadedUri == null) {
      return
    }
    return player.getPlayable(this.loadedUri)
  }

  public backward (): void {
    player.backward(10)
  }

  public get isBackwardDisabled (): boolean {
    return !this.isLoadedPlaying
  }

  public play (): void {
    player.play()
  }

  public get isPlayDisabled (): boolean {
    return this.isLoadedPlaying
  }

  public start (): void {
    player.start()
  }

  public get isStartDisabled (): boolean {
    return !this.isEnqueued
  }

  public stop (): void {
    player.stop()
  }

  public get isStopDisabled (): boolean {
    return !this.isLoadedPlaying
  }

  public pause (): void {
    player.pause()
  }

  public get isPauseDisabled (): boolean {
    return !this.isLoadedPlaying
  }

  public forward (): void {
    player.forward(10)
  }

  public get isForwardDisabled (): boolean {
    return !this.isLoadedPlaying
  }
}
</script>

<style lang="scss">
.vc_controll_buttons {
}
</style>
