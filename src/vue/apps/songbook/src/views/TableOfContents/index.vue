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

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { mapGetters } from 'vuex'

import { AlphabeticalSongsTree } from '@bldr/songbook-core'

import TocAbc from './TocAbc.vue'

@Component({
  components: {
    TocAbc
  },
  computed: {
    ...mapGetters(['alphabeticalSongsTree'])
  }
})
export default class TableOfContents extends Vue {
  alphabeticalSongsTree!: AlphabeticalSongsTree
}
</script>

<style scoped>
.vc_table_of_contents {
  margin: 2vw;
}
</style>
