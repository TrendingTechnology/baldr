<template>
  <div class="vc_component_video_screen_demo">
    <h1>Test component “Videoscreen”</h1>
    <video-screen :src="src" />
    <playable-selector :simple-assets="simpleAssets" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

import { player } from '@bldr/player'

import PlayableSelector, { eventBus } from './PlayableSelector.vue'
import { resolver, data } from '../../app'

@Component({ components: { PlayableSelector } })
export default class VideoScreenDemo extends Vue {
  src!: string

  data () {
    return {
      src: null
    }
  }

  get simpleAssets () {
    return [data.oops, data.entstehung, data.intonarumori]
  }

  mounted () {
    eventBus.$on('select-playable', this.listenOnPlayableSelection)
    this.loadAndStart(data.oops.uuid)
  }

  async loadAndStart (uuid: string) {
    await resolver.resolve(uuid)
    await player.start(uuid)
    this.src = uuid
  }

  listenOnPlayableSelection (uuid: string) {
    console.log(uuid)
    this.loadAndStart(uuid)
  }
}
</script>
