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

    <table>
      <tr>
        <td>volume</td>
        <td ref="volume"></td>
      </tr>
      <tr>
        <td>elapsedTimeSec</td>
        <td ref="elapsedTimeSec"></td>
      </tr>
      <tr>
        <td>remainingTimeSec</td>
        <td ref="remainingTimeSec"></td>
      </tr>
      <tr>
        <td>playbackState</td>
        <td ref="playbackState"></td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from '@bldr/vue-packages-bundler'
import { resolver } from '../../app'
import { player } from '../../plugin'
import { Playable } from '../../playable'

function setTextContent (
  element: Vue | Element | Vue[] | Element[],
  value: any
): void {
  const htmlElement = element as HTMLElement
  htmlElement.textContent = value.toString()
}

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
      setTextContent(this.$refs.volume, playable.volume)
      setTextContent(this.$refs.elapsedTimeSec, playable.elapsedTimeSec)
      setTextContent(this.$refs.remainingTimeSec, playable.remainingTimeSec)
    })
  }

  beforeDestroy () {
    if (this.playable == null) {
      return
    }
    this.playable.stall()
  }
}
</script>
