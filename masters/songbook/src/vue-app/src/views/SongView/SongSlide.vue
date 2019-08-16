
<template>
  <section class="song-slide">
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

<style scoped>
  section {
    text-align: center;
  }

  img {
    height: auto;
    max-height: 100vh;
    max-width: 100%;
    vertical-align: middle;
    width: 100%;
  }

  .slide-number {
    padding: 1vw;
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 1;
    font-size: 1vw;
    opacity: 0;
  }

  .fade-out {
    animation: fadeout 2s linear forwards;
  }

  @keyframes fadeout {
    0% { opacity: 1; }
    100% { opacity: 0; }
  }

  .cursor-cross {
    position: absolute;
    bottom: 0;
    right: 0;
  }

  .random {
    position: absolute;
    bottom: 0;
    left: 0;
  }

  .top-icons {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
  }
</style>
