
<template>
  <section class="vc_song_slide">
    <meta-data/>
    <img :src="imageSrc">
    <div class="slide-number"></div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import { formatMultiPartAssetFileName } from '@bldr/core-browser'

import MetaData from './MetaData'

export default {
  name: 'SongSlide',
  components: {
    MetaData
  },
  computed: {
    ...mapGetters(['songCurrent', 'slideNo']),
    abc () {
      return this.songCurrent.abc
    },
    songId () {
      return this.songCurrent.songId
    },
    // slideNo () {
    //   if (this.slideNo <= 9) {
    //     return `0${this.slideNo}`
    //   }
    //   return this.slideNo
    // },
    imageSrc () {
      return formatMultiPartAssetFileName(`./songs/${this.abc}/${this.songId}/NB/Projektor.svg`, this.slideNo)
    }
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
