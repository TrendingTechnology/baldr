<template>
  <div class="vc_media_player_ng">MediaPlayerNg {{ playingTitel }}</div>
</template>

<script lang="ts">
import { formatDuration } from '@bldr/string-format'
import { Component, Vue, Watch } from '@bldr/vue-packages-bundler'
import { player } from '../../plugin'

@Component
export default class MediaPlayerNg extends Vue {
  playerUris!: { loaded?: string; playing?: string }
  data () {
    return {
      playerUris: player.uris
    }
  }

  get playingTitel (): string | undefined {
    if (this.playerUris.playing != null) {
      const playable = player.getPlayable(this.playerUris.playing)
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
