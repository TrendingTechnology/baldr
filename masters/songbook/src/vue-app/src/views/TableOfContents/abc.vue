<template>
  <div>
    <h2>{{ abc }}</h2>
    <table>
      <toc-song
        v-for="song in songs"
        :key="song.songID"
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
