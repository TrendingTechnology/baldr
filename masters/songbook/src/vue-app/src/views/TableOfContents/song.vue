<template>
  <tr>
    <td class="main-column">
      <router-link :to="{ name: 'song', params: { songID: song.songID }}">
        <span class="title" v-if="meta.title">{{ meta.title }} </span>
        <span class="subtitle" v-if="meta.subtitle">{{ meta.subtitle }} </span>
        <span class="composer" v-if="meta.composer">{{ meta.composer }} </span>
        <span class="lyricist" v-if="meta.lyricist">{{ meta.lyricist }} </span>
      </router-link>
    </td>

    <td>
      <a
        v-if="meta.musescoreURL"
        :href="meta.musescoreURL"
      >
        <material-icon name="file-music-outline"/>
      </a>
    </td>

    <td>
      <a
        v-if="meta.wikipediaURL"
        :href="meta.wikipediaURL"
      >
        <material-icon name="wikipedia"/>
      </a>
    </td>

    <td>
      <a
        v-if="meta.youtubeURL"
        :href="meta.youtubeURL"
      >
        <material-icon name="youtube"/>
      </a>
    </td>
  </tr>
</template>

<script>
import { MaterialIcon } from '@bldr/vue-components'

export default {
  name: 'TocSong',
  components: {
    MaterialIcon
  },
  computed: {
    meta () {
      return this.song.metaDataCombined
    }
  },
  props: {
    song: Object
  }
}
</script>

<style scoped>
  .main-column {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 0;
  }

  .title {
    font-size: 1.5em;
  }

  .subtitle {
    opacity: 0.8;
  }

  .composer {
    font-style: italic;
    opacity: 0.6;
  }

  .lyricist {
    opacity: 0.6;
  }
</style>
