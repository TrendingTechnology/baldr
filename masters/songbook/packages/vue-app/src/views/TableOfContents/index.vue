<template>
  <div>
    <h1>Inhaltsverzeichnis</h1>
      <toc-abc
        v-for="(songList, abc) in songs"
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
  computed: mapGetters(['songs'])
}
</script>
