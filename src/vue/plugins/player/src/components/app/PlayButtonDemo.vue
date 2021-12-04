<template>
  <div>
    <h1>PlayButton</h1>

    <play-button :playable="spanish" />
    <play-button :playable="dutchmen" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
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
    this.spanish = player.getPlayable(uri + '#Spanier')
    this.dutchmen = player.getPlayable(uri + '#Niederlaender')
  }
}
</script>
