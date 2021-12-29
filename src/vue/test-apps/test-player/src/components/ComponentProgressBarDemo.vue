<template>
  <div class="vc_component_progress_bar_demo">
    <h1>ComponentProgressBarDemo</h1>
    <progress-bar :playable="playable"></progress-bar>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

import { player, Playable, ProgressBar } from '@bldr/player'

import { resolver } from '../app'

@Component({ components: { ProgressBar } })
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
