<template>
  <div class="vc_component_wave_form_demo">
    <h1>ComponentWaveFormDemo</h1>
    <wave-form :uri="uri"></wave-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

import { player, WaveForm } from '@bldr/player'

import { resolver } from '../app'

@Component({ components: { WaveForm } })
export default class ComponentWaveFormDemo extends Vue {
  uri = 'uuid:702ba259-349a-459f-bc58-cf1b0da37263'

  async mounted () {
    // ref:Grosses-Tor_HB_Orchester_Samples
    // uuid:702ba259-349a-459f-bc58-cf1b0da37263
    await resolver.resolve(this.uri)
    player.start(this.uri)
  }
}
</script>

<style lang="scss">
.vc_component_wave_form_demo {
  background-color: $yellow;
}
</style>
