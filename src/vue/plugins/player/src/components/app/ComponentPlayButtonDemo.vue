<template>
  <div class="vc_play_button_demo">
    <h1>ComponentPlayButtonDemo</h1>

    <h2>Das große Tor von Kiew</h2>
    Das große Tor
    <play-button-ng :playable="gate" />
    Kapelle
    <play-button-ng :playable="chapel" />
    Glocken
    <play-button-ng :playable="chimes" />
    Menschen laufen durch das Tor
    <play-button-ng :playable="people" />

    <h2>Zwei mal das gleiche Sample</h2>
    Glocken
    <play-button-ng :playable="chimes" />
    Glocken
    <play-button-ng v-if="!isOnePlayButtonVisible" :playable="chimes" />

    <p>
      <button @click="hideOnePlayButton()">Verberge PlayButton</button>
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from '@bldr/vue-packages-bundler'
import { resolver } from '../../app'
import { player } from '../../plugin'
import { Playable } from '../../playable'

@Component
export default class ComponentPlayButtonDemo extends Vue {
  isOnePlayButtonVisible!: boolean
  gate!: Playable
  chapel!: Playable
  chimes!: Playable
  people!: Playable

  data () {
    return {
      isOnePlayButtonVisible: false,
      gate: undefined,
      chapel: undefined,
      chimes: undefined,
      people: undefined
    }
  }

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
