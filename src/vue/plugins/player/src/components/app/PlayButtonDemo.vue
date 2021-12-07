<template>
  <div class="vc_play_button_demo">
    <h1>PlayButton</h1>

    <h2>Das große Tor von Kiew</h2>
    Das große Tor
    <play-button :playable="gate" />
    Kapelle
    <play-button :playable="chapel" />
    Glocken
    <play-button :playable="chimes" />
    Menschen laufen durch das Tor
    <play-button :playable="people" />

    <h2>Zwei mal das gleiche Sample</h2>
    Glocken
    <play-button :playable="chimes" />
    Glocken
    <play-button v-if="!isOnePlayButtonVisible" :playable="chimes" />

    <p>
      <button @click="hideOnePlayButton()">Verberge PlayButton</button>
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from '@bldr/vue-packages-bundler'
import { player, resolver } from '../../app'
import { Playable } from '../../main'

import PlayButton from '../plugin/PlayButton.vue'

@Component({ components: { PlayButton } })
export default class PlayButtonDemo extends Vue {
  isOnePlayButtonVisible: boolean = false

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

  hideOnePlayButton (): void {
    this.isOnePlayButtonVisible = !this.isOnePlayButtonVisible
  }
}
</script>

<style lang="scss">
.vc_play_button_demo {
  .vc_play_button {
    font-size: 5em;
  }
}
</style>
