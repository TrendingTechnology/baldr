<template>
  <div class="vc_top_abc">
    <h2>{{ abc }}</h2>
    <table>
      <toc-song
        v-for="song in songs"
        :key="song.songId"
        :song="song"
      />
    </table>
  </div>
</template>

<script>
import TocSong from './song'

export default {
  name: 'TocAbc',
  components: {
    TocSong
  },
  props: {
    abc: String,
    songs: Array
  }
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
