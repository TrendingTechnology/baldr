<template>
  <div class="vc_component_video_screen_demo">
    <h1>Test component “Videoscreen”</h1>
    <video-screen :playable="playable" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

import { player, Playable, VideoScreen } from '@bldr/player'

import { resolver, data } from '../../app'

@Component({ components: { VideoScreen } })
export default class VideoScreenDemo extends Vue {
  playable!: Playable

  data () {
    return {
      playable: undefined
    }
  }

  async mounted () {
    await resolver.resolve(data.oops.uuid)
    this.playable = player.getPlayable(data.oops.uuid)
    player.start(data.oops.uuid)
  }
}
</script>
