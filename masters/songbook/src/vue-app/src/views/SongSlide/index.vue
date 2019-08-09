
<template>
  <section>
    <div class="top-icons">
      <material-icon
        @click.native="$modal.show('search')"
        class="table-of-contents"
        name="magnify"
        size="5vw"
      />
      <material-icon
        @click.native="$modal.show('table-of-contents')"
        class="table-of-contents"
        name="table-of-contents"
        size="5vw"
      />
    </div>

    <modal-dialog name="search">
      <dynamic-select :options="library.toDynamicSelect()"/>
    </modal-dialog>
    <modal-dialog name="table-of-contents">
      <table-of-contents/>
    </modal-dialog>
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
    <material-icon
      @click.native="setSongRandom"
      class="random"
      name="dice-multiple"
      size="5vw"
    />
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import { CursorCross, DynamicSelect, MaterialIcon } from '@bldr/vue-components'

import MetaData from './MetaData'
import TableOfContents from '@/views/TableOfContents'

export default {
  name: 'SongSlide',
  components: {
    CursorCross,
    DynamicSelect,
    MaterialIcon,
    MetaData,
    TableOfContents
  },
  computed: {
    ...mapGetters(['songCurrent', 'slideNoCurrent', 'library']),
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
