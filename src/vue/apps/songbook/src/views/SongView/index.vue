<template>
  <div class="vc_song_view">
    <div class="top-icons">
      <material-icon
        vanish
        @click.native="showSearch"
        name="magnify"
        :size="materialIconSize"
        title="Suche nach einem Lied (Tastenkürzel: s)"
      />
      <material-icon
        vanish
        @click.native="showTableOfContents"
        name="table-of-contents"
        :size="materialIconSize"
        title="Inhaltsverzeichnis (Tastenkürzel: i)"
      />
      <material-icon
        vanish
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
      <table-of-contents />
    </modal-dialog>
    <song-slide />
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
      vanish
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

import CursorCross from './CursorCross.vue'
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
    ...mapGetters(['songCurrent', 'slideNo', 'library']),
    abc () {
      return this.songCurrent.abc
    },
    songId () {
      return this.songCurrent.songId
    },
    slideNo () {
      if (this.slideNo <= 9) {
        return `0${this.slideNo}`
      }
      return this.slideNo
    },
    imageSrc () {
      return `/songs/${this.abc}/${this.songId}/${this.slideNo}.svg`
    }
  },
  methods: {
    ...mapActions([
      'browseAllSlidesNext',
      'browseAllSlidesPrevious',
      'setSlideNext',
      'setSlidePrevious'
    ]),
    selectSong () {
      this.$modal.hide('search')
      this.setSong(this.selectedSong.ref)
      //this.$shortcuts.unpause()
    },
    setSong (songId) {
      this.$router.push({ name: 'song', params: { songId: songId } })
    },
    setSongNext () {
      this.setSong(this.library.getNextSong().songId)
    },
    setSongPrevious () {
      this.setSong(this.library.getPreviousSong().songId)
    },
    setSongRandom () {
      this.setSong(this.library.getRandomSong().songId)
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
    this.$store.dispatch('setSongCurrent', this.$route.params.songId)
  },
  beforeRouteUpdate (to, from, next) {
    this.$store.dispatch('setSongCurrent', to.params.songId)
    this.resolveAudio()
    this.$modal.hide('table-of-contents')
    next()
  },
  mounted: function () {
    this.resolveAudio()
    this.$shortcuts.addMultiple([
      {
        keys: 'left',
        callback: () => {
          this.setSlidePrevious()
        },
        // 'Previous slide'
        description: 'Vorhergehende Folie'
      },
      {
        keys: 'right',
        callback: () => {
          this.setSlideNext()
        },
        // 'Next slide'
        description: 'Nächste Folie'
      },
      {
        keys: 'alt+left',
        callback: () => {
          this.browseAllSlidesPrevious()
        },
        // 'Previous slide'
        description: 'Vorhergehende Folie (durch alle Lieder blättern)'
      },
      {
        keys: 'alt+right',
        callback: () => {
          this.browseAllSlidesNext()
        },
        // 'Next slide'
        description: 'Nächste Folie (durch alle Lieder blättern)'
      },
      {
        keys: 'up',
        callback: () => {
          this.setSongPrevious()
        },
        // 'Previous song'
        description: 'Nächstes Lied'
      },
      {
        keys: 'down',
        callback: () => {
          this.setSongNext()
        },
        // 'Next song'
        description: 'Vorhergehendes Lied'
      },
      {
        keys: 'z',
        callback: () => {
          this.setSongRandom()
        },
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
