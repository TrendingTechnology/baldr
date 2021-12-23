<template>
  <section class="vc_song_slide">
    <meta-data />
    <img :src="imageSrc" />
    <div class="slide-number"></div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { mapGetters } from 'vuex'

import { formatMultiPartAssetFileName } from '@bldr/string-format'
import { Song } from '@bldr/songbook-core'

import MetaData from './MetaData.vue'

@Component({
  components: {
    MetaData
  },
  computed: {
    ...mapGetters(['songCurrent', 'slideNo'])
  }
})
export default class SongSlide extends Vue {
  songCurrent!: Song

  slideNo!: number

  get abc () {
    return this.songCurrent.abc
  }

  get songId () {
    return this.songCurrent.songId
  }

  get imageSrc () {
    return formatMultiPartAssetFileName(
      `./songs/${this.abc}/${this.songId}/NB/Projektor.svg`,
      this.slideNo
    )
  }
}
</script>

<style lang="scss" scoped>
.vc_song_slide {
  text-align: center;

  img {
    height: auto;
    max-height: 100vh;
    max-width: 100%;
    vertical-align: middle;
    width: 100%;
  }
}
</style>
