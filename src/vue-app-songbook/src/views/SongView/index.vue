
<template>
  <div class="vc_song_view">
    <div class="top-icons">
      <material-icon
        @click.native="showSearch"
        name="magnify"
        :size="materialIconSize"
        title="Suche nach einem Lied (Tastenkürzel: s)"
      />
      <material-icon
        @click.native="showTableOfContents"
        name="table-of-contents"
       :size="materialIconSize"
       title="Inhaltsverzeichnis (Tastenkürzel: i)"
      />
      <material-icon
        @click.native="$fullscreen()"
        name="fullscreen"
       :size="materialIconSize"
       title="Vollbild (Tastenkürzel: f)"
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
      left-title="Vorhergehende Seite (Tastenkürzel: Cursor links)"
      right-title="Nächste Seite (Tastenkürzel: Cursor rechts)"
      up-title="Vorhergehendes Lied (Tastenkürzel: Cursor oben)"
      down-title="Nächstes Lied (Tastenkürzel: Cursor unten)"
    />
    <material-icon
      @click.native="setSongRandom"
      class="random"
      name="dice-multiple"
      :size="materialIconSize"
      title="Zufälliges Lied (Tastenkürzel: z)"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import { CursorCross } from '@bldr/vue-plugin-components-collection'

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
      const visibility = this.$modal.toggle('search')
      if (visibility) {
        this.$shortcuts.pause()
      } else {
        this.$shortcuts.unpause()
      }
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
        keys: 'z',
        callback: () => { this.setSongRandom() },
        description: 'Einen zufälliges Lied einblenden'
      },
      {
        keys: 'i',
        callback: () => {
          this.$modal.toggle('table-of-contents')
        },
        description: 'Das Inhaltsverzeichnis einblenden'
      },
      {
        keys: 's',
        callback: () => {
          this.showSearch()
        },
        description: 'Die Liedersuche einblenden'
      }
    ])
  }
}
</script>

<style lang="scss" scoped>
  .vc_song_view {
    .vc_cursor_cross {
      bottom: 0;
      position: fixed;
      right: 0;
    }

    .random {
      bottom: 0;
      left: 0;
      position: fixed;
    }

    .top-icons {
      position: fixed;
      right: 0;
      top: 0;
      z-index: 1;
    }
  }
</style>
