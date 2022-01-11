<template>
  <div class="vc_controll_buttons">
    <plain-icon name="skip-previous" @click.native="backward()" />
    <plain-icon name="play" @click.native="play()" />
    <plain-icon name="pause" @click.native="pause()" />
    <plain-icon name="skip-next" @click.native="forward()" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

import { PlainIcon } from '@bldr/icons'

import { player } from '../plugin'

@Component({
  components: {
    PlainIcon
  }
})
export default class ControllButtons extends Vue {
  play () {
    player.start()
  }

  pause () {
    player.pause()
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
