<template>
  <div>
    <h1>ClassPlayerDemo</h1>
    <h2>Stückauswahl</h2>

    <button @click="player.start('uuid:4f6c6b03-e5d1-4fc8-8bb9-ab3ffea8fb64')">
      ref:Du-bist-als-Kind-zu-heiss-gebadet-worden
    </button>

    <button @click="player.start('uuid:3e7d9633-6713-4f21-8c3d-f75ccc4ed38a')">
      ref:Ich-hab-zu-Haus-ein-Grammophon
    </button>

    <button @click="player.start('uuid:127abf7e-8b86-4bc3-8064-88efbc4c7f9e')">
      ref:Mein-kleiner-gruener-Kaktus
    </button>

    <h2>Steuerung</h2>

    <button @click="player.start()">start</button>
    <button @click="player.stop()">stop</button>
    <button @click="player.toggle()">toggle</button>
    <button @click="player.pause()">pause</button>
    <button @click="player.backward()">backward</button>
    <button @click="player.forward()">forward</button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

import { resolver } from '../../app'
import { player } from '../../plugin'

@Component
export default class ClassPlayerDemo extends Vue {
  get player () {
    return player
  }

  async mounted () {
    // ref:Du-bist-als-Kind-zu-heiss-gebadet-worden
    // uuid:4f6c6b03-e5d1-4fc8-8bb9-ab3ffea8fb64

    // ref:Ich-hab-zu-Haus-ein-Grammophon
    // uuid:3e7d9633-6713-4f21-8c3d-f75ccc4ed38a

    // ref:Mein-kleiner-gruener-Kaktus
    // uuid:127abf7e-8b86-4bc3-8064-88efbc4c7f9e

    const uri = 'uuid:127abf7e-8b86-4bc3-8064-88efbc4c7f9e'
    await resolver.resolve([
      'uuid:4f6c6b03-e5d1-4fc8-8bb9-ab3ffea8fb64',
      'uuid:3e7d9633-6713-4f21-8c3d-f75ccc4ed38a',
      'uuid:127abf7e-8b86-4bc3-8064-88efbc4c7f9e'
    ])
    player.load(uri)
    await player.start()
  }
}
</script>
