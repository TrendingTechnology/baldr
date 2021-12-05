<template>
  <div class="vc_play_button_demo">
    <h1>PlayButton</h1>

    <div class="buttons">
      <play-button :playable="gate" />
      <play-button :playable="chapel" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from '@bldr/vue-packages-bundler'
import { player, resolver } from '../../app'
import { Playable } from '../../main'

import PlayButton from '../plugin/PlayButton.vue'

@Component({ components: { PlayButton } })
export default class PlayButtonDemo extends Vue {
  gate: Playable | null = null

  chapel: Playable | null = null

  chimes: Playable | null = null

  people: Playable | null = null

  async mounted () {
    // ref:Egmont_HB_Egmont-Ouverture
    // uuid:70028b77-b817-46e2-b6fa-fe3c6383d748
    // #Thema_Spanier
    // #Thema_Niederlaender

    // ref:Grosses-Tor_HB_Orchester_Samples
    // uuid:702ba259-349a-459f-bc58-cf1b0da37263
    const uri = 'uuid:702ba259-349a-459f-bc58-cf1b0da37263'
    await resolver.resolve(uri)
    this.gate = player.getPlayable(uri + '#tor')
    this.chapel = player.getPlayable(uri + '#kapelle')
    this.chimes = player.getPlayable(uri + '#glocken')
    this.people = player.getPlayable(uri + '#menschen')
  }
}
</script>

<style lang="scss">
.vc_play_button_demo {
  .buttons {
    font-size: 10em;
  }
}
</style>
