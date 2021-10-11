<template>
  <tr class="vc_toc_song">
    <td class="main-column">
      <router-link :to="{ name: 'song', params: { songId: song.songId } }">
        <span class="title" v-if="meta.title">{{ meta.title }} </span>
        <span class="subtitle" v-if="meta.subtitle">{{ meta.subtitle }} </span>
        <span class="composer" v-if="meta.composer">{{ meta.composer }} </span>
        <span class="lyricist" v-if="meta.lyricist">{{ meta.lyricist }} </span>
      </router-link>
    </td>
    <td
      class="icon-cell"
      v-for="externalSite in externalSites"
      :key="externalSite"
    >
      <icon-link :icon="externalSite" :link="meta[externalSite + 'Url']" />
    </td>
  </tr>
</template>

<script>
import { mapGetters } from 'vuex'

import IconLink from '@/components/IconLink'

export default {
  name: 'TocSong',
  components: {
    IconLink
  },
  computed: {
    ...mapGetters(['externalSites']),
    meta () {
      return this.song.metaDataCombined
    }
  },
  props: {
    song: Object
  }
}
</script>

<style lang="scss" scoped>
.vc_toc_song {
  .main-column {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 0;
    font-size: 0.8em;
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

  .icon-cell {
    min-width: 4vw;
  }
}
</style>
