
<template>
  <div class="song-view">
    <div class="top-icons">
      <material-icon
        @click.native="showSearch"
        name="magnify"
        :size="materialIconSize"
      />
      <material-icon
        @click.native="showTableOfContents"
        name="table-of-contents"
       :size="materialIconSize"
      />
      <material-icon
        @click.native="$fullscreen()"
        name="fullscreen"
       :size="materialIconSize"
      />
    </div>

    <modal-dialog name="search">
      <dynamic-select
        placeholder="Suche nach einem Lied"
        :options="library.toDynamicSelect()"
        @input="selectSong"
        v-model="selectedSong"
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
      :size="materialIconSize"
      left-title="Vorhergehende Seite"
      right-title="Nächste Seite"
      up-title="Vorhergehendes Lied"
      down-title="Nächstes Lied"
    />
    <material-icon
      @click.native="setSongRandom"
      class="random"
      name="dice-multiple"
      :size="materialIconSize"
      title="Zufälliges Lied"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import { CursorCross } from '@bldr/vue-components-collection'

import SongSlide from './SongSlide'
import TableOfContents from '@/views/TableOfContents'

export default {
  name: 'SongView',
  components: {
    CursorCross,
    SongSlide,
    TableOfContents
  },
  data () {
    return {
      selectedSong: null,
      materialIconSize: '3vw'
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
      'setSlidePrevious'
    ]),
    selectSong () {
      this.$modal.hide('search')
      this.setSong(this.selectedSong.id)
      this.$shortcuts.unpause()
    },
    setSong (songID) {
      this.$router.push({ name: 'song', params: { songID: songID } })
    },
    setSongNext () {
      this.setSong(this.library.getNextSong().songID)
    },
    setSongPrevious () {
      this.setSong(this.library.getPreviousSong().songID)
    },
    setSongRandom () {
      this.setSong(this.library.getRandomSong().songID)
    },
    showSearch () {
      this.$modal.toggle('search')
      this.$dynamicSelect.focus()
    },
    showTableOfContents () {
      this.$modal.show('table-of-contents')
    },
    resolveAudio () {
      if (this.songCurrent.metaData.audio) {
        this.$media.resolve(this.songCurrent.metaData.audio)
      }
    }
  },
  created: function () {
    this.$store.dispatch('setSongCurrent', this.$route.params.songID)
  },
  beforeRouteUpdate (to, from, next) {
    this.$store.dispatch('setSongCurrent', to.params.songID)
    this.resolveAudio()
    this.$modal.hide('table-of-contents')
    next()
  },
  mounted: function () {
    this.resolveAudio()
    this.$shortcuts.addMultiple([
      {
        keys: 'left',
        callback: () => { this.setSlidePrevious() },
        description: 'Previous slide'
      },
      {
        keys: 'right',
        callback: () => { this.setSlideNext() },
        description: 'Next slide'
      },
      {
        keys: 'up',
        callback: () => { this.setSongPrevious() },
        description: 'Previous song'
      },
      {
        keys: 'down',
        callback: () => { this.setSongNext() },
        description: 'Next song'
      },
      {
        keys: 'ctrl+z',
        callback: () => { this.setSongRandom() },
        description: 'Random song'
      },
      {
        keys: 'ctrl+s',
        callback: () => {
          this.$shortcuts.pause()
          this.showSearch()
        },
        description: 'Show search'
      },
      {
        keys: 'ctrl+f',
        callback: () => { this.$fullscreen() },
        description: 'Fullscreen'
      }
    ])
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
