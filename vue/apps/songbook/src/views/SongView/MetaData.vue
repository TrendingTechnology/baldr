<template>
  <div v-if="slideNo === 1" class="vc_meta_data">
    <h1>{{ title }}</h1>
    <h2 v-if="subtitle">{{ subtitle }}</h2>
    <audio v-if="audio" controls :src="audio"></audio>

    <div class="people">
      <div v-if="lyricist" class="lyricist">{{ lyricist }}</div>
      <div v-if="composer" class="composer">{{ composer }}</div>
    </div>
    <div class="links">
      <icon-link
        :icon="externalSite"
        :key="externalSite"
        :link="metadata[externalSite + 'URL']"
        show-on-hover
        v-for="externalSite in externalSites"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { mapGetters } from 'vuex'

import { Song } from '@bldr/songbook-core'
import store from '@/store'

import IconLink from '@/components/IconLink.vue'

@Component({
  components: {
    IconLink
  },
  computed: {
    ...mapGetters(['externalSites', 'slideNo', 'songCurrent'])
  }
})
export default class MetaData extends Vue {
  songCurrent!: Song
  get metadata () {
    return this.songCurrent.metaDataCombined
  }

  get title () {
    return this.metadata.title
  }

  get subtitle () {
    return this.metadata.subtitle
  }

  get lyricist () {
    return this.metadata.lyricist
  }

  get composer () {
    return this.metadata.composer
  }

  get audio () {
    const uri = this.songCurrent.metaData.audio
    if (uri) {
      const mediaFile = this.mediaFileByUri(uri)
      if (mediaFile) return mediaFile.httpUrl
    }
    return false
  }

  mediaFileByUri (uri: string) {
    return store.getters['media/assetByUri'](uri)
  }
}
</script>

<style lang="scss" scoped>
.vc_meta_data {
  padding-top: 0.2vw;
  position: absolute;
  width: 100%;

  .people {
    display: flex;
    font-size: 1.5vw;
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

  h1,
  h2 {
    margin: 1vw;
  }

  h1 {
    font-size: 3vw;
  }

  h2 {
    font-size: 2vw;
    font-style: italic;
  }
}
</style>
