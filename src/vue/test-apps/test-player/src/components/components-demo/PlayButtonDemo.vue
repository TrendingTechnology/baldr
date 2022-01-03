<template>
  <div class="vc_play_button_demo">
    <h1>Test component “PlayButton”</h1>

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

    <h1>ComponentResolveablePlayButton</h1>

    <resolveable-play-button :uri="testData.cheikha.uuid" />

    <resolveable-play-button :uri="testData.aicha.uuid" />

    <resolveable-play-button :uri="testData.mannenberg.uuid" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

import { player, Playable } from '@bldr/player'

import { resolver, data } from '../../app'

@Component
export default class PlayButtonDemo extends Vue {
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

  get testData(): Record<string, any> {
    return data
  }

  async mounted () {
    const uri = data.tor.uuid
    const samples = data.tor.samples
    await resolver.resolve(uri)
    this.gate = player.getPlayable(uri + samples.tor)
    this.chapel = player.getPlayable(uri + samples.kapelle)
    this.chimes = player.getPlayable(uri + samples.glocken)
    this.people = player.getPlayable(uri + samples.menschen)
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
