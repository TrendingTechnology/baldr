<template>
  <div class="vc_media_player_ng">MediaPlayerNg {{ playingTitel }}</div>
</template>

<script lang="ts">
import { Component, Vue } from '@bldr/vue-packages-bundler'
import { player } from '../../plugin'

@Component
export default class MediaPlayerNg extends Vue {
  loadedUri?: string
  playingUri?: string
  data () {
    return player.uris
  }

  get playingTitel (): string | undefined {
    if (this.playingUri != null) {
      const playable = player.getPlayable(this.playingUri)
      return playable.sample.titleSafe
    }
  }
}
</script>

<style lang="scss">
.vc_media_player_ng {
  font-weight: bold;
}
</style>
