<template>
  <div class="vc_play_button_demo">
    <h1>PlayButton</h1>

    <div class="buttons">
      <play-button :playable="spanish" />
      <play-button :playable="dutchmen" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from '@bldr/vue-packages-bundler'
import { player, resolver } from '../../app'
import { Playable } from '../../main'

import PlayButton from '../plugin/PlayButton.vue'

@Component({ components: { PlayButton } })
export default class PlayButtonDemo extends Vue {
  spanish: Playable | null = null

  dutchmen: Playable | null = null

  async mounted () {
    // ref:Egmont_HB_Egmont-Ouverture
    // uuid:70028b77-b817-46e2-b6fa-fe3c6383d748

    const uri = 'uuid:70028b77-b817-46e2-b6fa-fe3c6383d748'
    await resolver.resolve(uri)
    this.spanish = player.getPlayable(uri + '#Thema_Spanier')
    this.dutchmen = player.getPlayable(uri + '#Thema_Niederlaender')
  }
}
</script>

<style lang="scss">
.vc_play_button_demo {
  .buttons {
    font-size: 10em;
  }
}
</style>
