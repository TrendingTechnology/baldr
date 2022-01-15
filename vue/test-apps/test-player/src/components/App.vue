<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>
      <ul>
        <li>
          Components:
          <router-link to="/components/horizontal-play-buttons"
            >HorizontalPlayButtons</router-link
          >
          |
          <router-link to="/components/media-player">MediaPlayer</router-link>
          |
          <router-link to="/components/playable-base">PlayableBase</router-link>
          |
          <router-link to="/components/play-button">PlayButton</router-link>
          |
          <router-link to="/components/playable-text">PlayableText</router-link>
          |
          <router-link to="/components/progress-bar">ProgressBar</router-link>
          |
          <router-link to="/components/video-screen">VideoScreen</router-link>
          |
          <router-link to="/components/wave-form">WaveForm</router-link>
        </li>
        <li>
          Classes:

          <router-link to="/classes/playable">Playable</router-link>
          | <router-link to="/classes/player">Player</router-link>
        </li>
      </ul>
    </div>
    <router-view />

    <hr />

    <h2>Playable selector:</h2>

    Start on click:
    <input type="checkbox" id="checkbox" v-model="startOnClick" />
    <label for="checkbox">{{ startOnClick }}</label>

    <h2>audio</h2>

    <playable-selector mime-type="audio" />

    <h3>only samples</h3>

    <playable-selector mime-type="audio" only-samples="true" />

    <h2>video</h2>

    <playable-selector mime-type="video" />

    <controll-buttons />

    <dl>
      <dt>enqueuedUri:</dt>
      <dd>{{ enqueuedUri }} ({{ loadedTitle }})</dd>

      <dt>loadedUri:</dt>
      <dd>{{ loadedUri }} ({{ playingTitle }})</dd>
    </dl>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

import { ControllButtons, player } from '@bldr/player'

import PlayableSelector from './PlayableSelector.vue'

import { data } from '../app'

export let state: {
  startOnClick: boolean
  enqueuedUri?: string
  loadedUri?: string
  pausedUri?: string
}

@Component({ components: { PlayableSelector, ControllButtons } })
export default class App extends Vue {
  enqueuedUri!: string

  loadedUri!: string
  data () {
    const data = Object.assign(player.data, { startOnClick: true })
    state = data
    return data
  }

  private getTitleFromUuid (uuid: string): string | undefined {
    for (const key in data) {
      const simpleAsset = data[key]
      if (simpleAsset.uuid === uuid) {
        if (simpleAsset.title != null) {
          return simpleAsset.title
        }
        if (simpleAsset.ref != null) {
          return simpleAsset.ref
        }
        return simpleAsset.uuid
      }
    }
  }

  get loadedTitle () {
    if (this.enqueuedUri != null) {
      return this.getTitleFromUuid(this.enqueuedUri)
    }
  }

  get playingTitle () {
    if (this.loadedUri != null) {
      return this.getTitleFromUuid(this.loadedUri)
    }
  }
}
</script>

<style lang="scss">
.vc_controll_buttons {
  font-size: 4em;
  margin: 1em;
}
</style>
