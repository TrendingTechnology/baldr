<template>
  <div class="vc_top_abc">
    <h2>{{ abc }}</h2>
    <table>
      <toc-song v-for="song in songs" :key="song.songId" :song="song" />
    </table>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from '@bldr/vue-packages-bundler'

import { Song } from '@bldr/songbook-core'

import TocSong from './TocSong.vue'
@Component({
  components: {
    TocSong
  }
})
export default class TocAbc extends Vue {
  @Prop()
  abc!: string

  @Prop()
  songs!: Song[]
}
</script>

<style lang="scss" scoped>
.vc_top_abc {
  h2 {
    text-transform: capitalize;
    font-style: normal;
    font-size: 4vw;
  }
}
</style>
