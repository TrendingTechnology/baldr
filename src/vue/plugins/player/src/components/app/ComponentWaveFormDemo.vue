<template>
  <div class="vc_component_wave_form_demo">
    <h1>ComponentProgressBarDemo</h1>
    <wave-form :playable="playable"></wave-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from '@bldr/vue-packages-bundler'
import { resolver } from '../../app'
import { player } from '../../plugin'
import { Playable } from '../../playable'

import WaveForm from '../plugin/WaveForm.vue'

@Component({ components: { WaveForm } })
export default class ComponentProgressBarDemo extends Vue {
  playable!: Playable

  data () {
    return {
      playable: undefined
    }
  }

  async mounted () {
    // ref:Grosses-Tor_HB_Orchester_Samples
    // uuid:702ba259-349a-459f-bc58-cf1b0da37263
    const uri = 'uuid:702ba259-349a-459f-bc58-cf1b0da37263'
    await resolver.resolve(uri)
    this.playable = player.getPlayable(uri)
    player.start(uri)
  }
}
</script>

<style lang="scss">
.vc_component_wave_form_demo {
  background-color: $yellow;
}
</style>
