
<template>
  <section class="vc_song_slide">
    <meta-data/>
    <img :src="imageSrc">
    <div class="slide-number"></div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'

import MetaData from './MetaData'

export default {
  name: 'SongSlide',
  components: {
    MetaData
  },
  computed: {
    ...mapGetters(['songCurrent', 'slideNoCurrent']),
    abc () {
      return this.songCurrent.abc
    },
    songID () {
      return this.songCurrent.songID
    },
    slideNo () {
      if (this.slideNoCurrent <= 9) {
        return `0${this.slideNoCurrent}`
      }
      return this.slideNoCurrent
    },
    imageSrc () {
      return `./songs/${this.abc}/${this.songID}/${this.slideNo}.svg`
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
