<template>
  <div>
    <h1>Playable</h1>

    <button @click="playable.start()">start()</button>
    <button @click="playable.stop(1)">stop(1)</button>
    <button @click="playable.stop(5)">stop(5)</button>
    <button @click="playable.stop(10)">stop(10)</button>
    <button @click="playable.play(0.1)">play(0.1)</button>
    <button @click="playable.play(0.5)">play(0.5)</button>
    <button @click="playable.play(1)">play(1)</button>
    <button @click="playable.play(1, 100, 10)">play(1, 100, 10)</button>
    <button @click="playable.backward()">backward()</button>
    <button @click="playable.forward()">forward()</button>
    <button @click="playable.toggle()">toggle()</button>
    <button @click="playable.pause()">pause()</button>

    <p ref="volume">volume</p>
    <p ref="currentTime">currentTime</p>
    <p ref="playbackState">playbackState</p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from '@bldr/vue-packages-bundler'
import { player, resolver } from '../../app'
import { Playable } from '../../main'

@Component
export default class PlayableDemo extends Vue {
  playable: Playable | null = null

  async mounted () {
    // ref:Egmont_HB_Egmont-Ouverture
    // uuid:70028b77-b817-46e2-b6fa-fe3c6383d748

    const uri = 'uuid:70028b77-b817-46e2-b6fa-fe3c6383d748'
    await resolver.resolve(uri)
    this.playable = player.getPlayable(uri)
    if (this.playable == null) {
      return
    }

    this.playable.registerPlaybackChangeListener(state => {
      const playbackState = this.$refs.playbackState as HTMLElement
      playbackState.textContent = state
    })

    this.playable.registerTimeUpdateListener(playable => {
      const volumeElement = this.$refs.volume as HTMLElement
      volumeElement.textContent = playable.volume.toString()

      const currentTimeElement = this.$refs.currentTime as HTMLElement
      currentTimeElement.textContent = playable.currentTimeSec.toString()
    })
  }
}
</script>
