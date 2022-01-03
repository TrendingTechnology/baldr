<template>
  <div class="vc_component_progress_bar_demo">
    <h1>Test component “ProgressBar”</h1>
    <progress-bar :playable="playable"></progress-bar>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

import { player, Playable, ProgressBar } from '@bldr/player'

import { resolver, data } from '../../app'

@Component({ components: { ProgressBar } })
export default class ComponentProgressBarDemo extends Vue {
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
