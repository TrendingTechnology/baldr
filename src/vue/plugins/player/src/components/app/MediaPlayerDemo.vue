<template>
  <div>
    <h1>Component MediaPlayer</h1>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from '@bldr/vue-packages-bundler'
import { resolver } from '../../app'

@Component
export default class MediaPlayerDemo extends Vue {

  async mounted () {
    // ref:Du-bist-als-Kind-zu-heiss-gebadet-worden
    // uuid:4f6c6b03-e5d1-4fc8-8bb9-ab3ffea8fb64

    // ref:Ich-hab-zu-Haus-ein-Grammophon
    // uuid:3e7d9633-6713-4f21-8c3d-f75ccc4ed38a

    // ref:Mein-kleiner-gruener-Kaktus
    // uuid:127abf7e-8b86-4bc3-8064-88efbc4c7f9e

    await resolver.resolve([
      'uuid:4f6c6b03-e5d1-4fc8-8bb9-ab3ffea8fb64',
      'uuid:3e7d9633-6713-4f21-8c3d-f75ccc4ed38a',
      'uuid:127abf7e-8b86-4bc3-8064-88efbc4c7f9e'
    ])
  }
}
</script>
