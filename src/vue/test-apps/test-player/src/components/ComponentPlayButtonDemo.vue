<template>
  <div class="vc_play_button_demo">
    <h1>ComponentPlayButtonDemo</h1>

    <h2>Das große Tor von Kiew</h2>
    Das große Tor
    <play-button-ng :uri="gate" />
    Kapelle
    <play-button-ng :uri="chapel" />
    Glocken
    <play-button-ng :uri="chimes" />
    Menschen laufen durch das Tor
    <play-button-ng :uri="people" />

    <h2>Zwei mal das gleiche Sample</h2>
    Glocken
    <play-button-ng :uri="chimes" />
    Glocken
    <play-button-ng v-if="!isOnePlayButtonVisible" :uri="chimes" />

    <p>
      <button @click="hideOnePlayButton()">Verberge PlayButton</button>
    </p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

import { resolver } from '../app'

    const uri = 'uuid:702ba259-349a-459f-bc58-cf1b0da37263'


@Component
export default class ComponentPlayButtonDemo extends Vue {
  isOnePlayButtonVisible!: boolean
  gate = uri + '#tor'
  chapel = uri + '#kapelle'
  chimes = uri + '#glocken'
  people = uri + '#menschen'

  data () {
    return {
      isOnePlayButtonVisible: false
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
