
<template>
  <section>
    <meta-data/>
    <img :src="imageSrc">
    <div class="slide-number"></div>
    <cursor-cross
      :left="setSlidePrevious"
      :right="setSlideNext"
      :up="setSongPrevious"
      :down="setSongNext"
      size="5vw"
    />
    <material-icon size="5vw" @click.native="setSongRandom" name="dice-multiple"/>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import { CursorCross, MaterialIcon } from '@bldr/vue-components'

import MetaData from './MetaData'

export default {
  name: 'SongSlide',
  components: {
    CursorCross,
    MaterialIcon,
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
      return `/songs/${this.abc}/${this.songID}/${this.slideNo}.svg`
    }
  },
  methods: mapActions([
    'setSlideNext',
    'setSlidePrevious',
    'setSongNext',
    'setSongPrevious',
    'setSongRandom'
  ]),
  created: function () {
    this.$store.dispatch('setSongCurrent', this.$route.params.songID)
  }
}
</script>

<style>
  section {
    max-width: 100%;
    max-height: 100%;
    text-align: center;
  }

  img {
    width: 100%;
    height: 100%;
    vertical-align: middle;
    background-color: white;
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

  .icon {
    height: 3vw;
    width: 3vw;
    display: inline-block;
    opacity: 0.1;
  }

  .icon:hover {
    opacity: 1;
  }

</style>
