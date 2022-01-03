<template>
  <div>
    <h1>Test component “MediaPlayer”</h1>

    <button @click="player.start(testData.gebadet.uuid)">
      ref:Du-bist-als-Kind-zu-heiss-gebadet-worden
    </button>

    <button @click="player.start(testData.grammophon.uuid)">
      ref:Ich-hab-zu-Haus-ein-Grammophon
    </button>

    <button @click="player.start(testData.kaktus.uuid)">
      ref:Mein-kleiner-gruener-Kaktus
    </button>

    <h2>MediaPlayer Instanz 1</h2>

    <media-player-ng></media-player-ng>

    <h2>MediaPlayer Instanz 2</h2>

    <media-player-ng></media-player-ng>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

import { player } from '@bldr/player'

import { resolver, data } from '../../app'

@Component
export default class MediaPlayerDemo extends Vue {
  get player () {
    return player
  }

  get testData () {
    return data
  }

  async mounted () {
    await resolver.resolve([
      data.gebadet.uuid,
      data.grammophon.uuid,
      data.kaktus.uuid
    ])
  }
}
</script>
