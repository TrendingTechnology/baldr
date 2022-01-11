<template>
  <div class="vc_controll_buttons">
    <clickable-icon name="backward" @click.native="backward()" />
    <clickable-icon name="play" @click.native="play()" />
    <clickable-icon name="stop" @click.native="stop()" />
    <clickable-icon name="pause" @click.native="pause()" />
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
  play () {
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
