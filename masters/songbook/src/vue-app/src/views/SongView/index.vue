
<template>
  <div class="song-view">
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
      <dynamic-select
        :options="library.toDynamicSelect()"
        @input="selectSong"
        v-model="selectedSongID"
      />
    </modal-dialog>
    <modal-dialog name="table-of-contents">
      <table-of-contents/>
    </modal-dialog>
    <song-slide/>
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
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import { CursorCross, DynamicSelect, MaterialIcon } from '@bldr/vue-components'

import SongSlide from './SongSlide'
import TableOfContents from '@/views/TableOfContents'

export default {
  name: 'SongView',
  components: {
    CursorCross,
    DynamicSelect,
    MaterialIcon,
    SongSlide,
    TableOfContents
  },
  data () {
    return {
      selectedSongID: null
    }
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
  methods: {
    ...mapActions([
      'setSlideNext',
      'setSlidePrevious',
      'setSongNext',
      'setSongPrevious',
      'setSongRandom'
    ]),
    selectSong: function () {
      if (this.selectedSongID) {
        this.$store.dispatch('setSongCurrent', this.selectedSongID)
        this.$modal.hide('search')
      }
    }
  },
  created: function () {
    this.$store.dispatch('setSongCurrent', this.$route.params.songID)
  }
}
</script>

<style>
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
