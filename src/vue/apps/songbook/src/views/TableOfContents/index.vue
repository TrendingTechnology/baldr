<template>
  <div class="vc_table_of_contents">
    <h1>Inhaltsverzeichnis</h1>
      <toc-abc
        v-for="(songList, abc) in alphabeticalSongsTree"
        :key="abc"
        :songs="songList"
        :abc="abc"
      />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TocAbc from './abc'

export default {
  name: 'TableOfContents',
  components: {
    TocAbc
  },
  computed: mapGetters(['alphabeticalSongsTree'])
}
</script>

<style scoped>
  .vc_table_of_contents {
    margin: 2vw;
  }
</style>
