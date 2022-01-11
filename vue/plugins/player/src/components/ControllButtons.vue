<template>
  <div class="vc_controll_buttons">
    <clickable-icon name="backward" @click.native="backward()" />
    <clickable-icon name="play" :disabled="isPlaying" @click.native="start()" />
    <clickable-icon name="stop" :disabled="!isPlaying" @click.native="stop()" />
    <clickable-icon
      name="pause"
      :disabled="!isPlaying"
      @click.native="pause()"
    />
    <clickable-icon name="forward" @click.native="forward()" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

import { ClickableIcon } from '@bldr/icons'

import { player } from '../plugin'

@Component({
  components: {
    ClickableIcon
  }
})
export default class ControllButtons extends Vue {
  loadedUri?: string
  playingUri?: string

  data () {
    return player.data
  }

  get isPlaying (): boolean {
    return this.playingUri != null
  }

  start () {
    player.start()
  }

  pause () {
    player.pause()
  }

  stop () {
    player.stop()
  }

  forward () {
    player.forward(10)
  }

  backward () {
    player.backward(10)
  }
}
</script>

<style lang="scss">
.vc_controll_buttons {
}
</style>
