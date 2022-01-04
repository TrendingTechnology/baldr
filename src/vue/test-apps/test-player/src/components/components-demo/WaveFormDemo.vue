<template>
  <div class="vc_component_wave_form_demo">
    <h1>Test component “WaveForm”</h1>
    <wave-form :src="playable"></wave-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

import { player, Playable, WaveForm } from '@bldr/player'

import { resolver, data } from '../../app'

@Component({ components: { WaveForm } })
export default class ComponentWaveFormDemo extends Vue {
  playable!: Playable

  data () {
    return {
      playable: undefined
    }
  }

  async mounted () {
    await resolver.resolve(data.tor.uuid)
    this.playable = player.getPlayable(data.tor.uuid)
    player.start(data.tor.uuid)
  }
}
</script>

<style lang="scss">
.vc_component_wave_form_demo {
  background-color: $yellow;
}
</style>
