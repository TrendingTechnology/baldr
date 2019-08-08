<template>
  <div v-if="slideNoCurrent === 1" class="metadata">
    <h1>{{ title }}</h1>
    <h2 v-if="subtitle">{{ subtitle }}</h2>
    <div class="people">
      <div v-if="lyricist" class="lyricist">{{ lyricist }}</div>
      <div v-if="composer" class="composer">{{ composer }}</div>
    </div>
    <div class="links">
      <icon-link icon="file-music-outline" :link="metadata.musescoreURL"/>
      <icon-link icon="wikipedia" :link="metadata.wikipediaURL"/>
      <icon-link icon="youtube" :link="metadata.youtubeURL"/>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import IconLink from '@/components/IconLink'

export default {
  name: 'MetaData',
  components: {
    IconLink
  },
  computed: {
    ...mapGetters([
      'slideNoCurrent',
      'songCurrent'
    ]),
    metadata () {
      return this.songCurrent.metaDataCombined
    },
    title () {
      return this.metadata.title
    },
    subtitle () {
      return this.metadata.subtitle
    },
    lyricist () {
      return this.metadata.lyricist
    },
    composer () {
      return this.metadata.composer
    }
  }
}
</script>

<style>
  .metadata {
    padding-top: 0.2vw;
    position: absolute;
    width: 100%;
  }

  .people {
    display: flex;
    font-size: 2vw;
    padding: 3vw;
  }

  .people > div {
    flex: 1;
  }

  .composer {
    text-align: right;
  }

  .links {
    position: absolute;
    left: 5vw;
    top: 1vw;
  }

  .links > div {
    flex: 1;
  }

  .lyricist {
    text-align: left;
  }

  h1, h2 {
    margin: 1vw;
  }

  h1 {
    font-size: 4vw;
  }

  h2 {
    font-size: 3vw;
    font-style: italic;
  }
</style>
