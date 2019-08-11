
<template>
  <div class="song-view">
    <div class="top-icons">
      <material-icon
        @click.native="showSearch"
        class="table-of-contents"
        name="magnify"
        size="5vw"
      />
      <material-icon
        @click.native="showTableOfContents"
        class="table-of-contents"
        name="table-of-contents"
        size="5vw"
      />
    </div>

    <modal-dialog name="search">
      <dynamic-select
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
      size="5vw"
      left-title="Vorhergehende Seite"
      right-title="Nächste Seite"
      up-title="Vorhergehendes Lied"
      down-title="Nächstes Lied"
    />
    <material-icon
      @click.native="setSongRandom"
      class="random"
      name="dice-multiple"
      size="5vw"
      title="Zufälliges Lied"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import { CursorCross } from '@bldr/vue-components'

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
      selectedSong: null
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
    selectSong () {
      this.$store.dispatch('setSongCurrent', this.selectedSong.id)
      this.$modal.hide('search')
    },
    showSearch () {
      this.$modal.toggle('search')
      this.$dynamicSelect.focus()
    },
    showTableOfContents () {
      this.$modal.show('table-of-contents')
    }
  },
  created: function () {
    this.$store.dispatch('setSongCurrent', this.$route.params.songID)
  },
  beforeRouteUpdate (to, from, next) {
    this.$store.dispatch('setSongCurrent', to.params.songID)
    this.$modal.hide('table-of-contents')
    next()
  },
  mounted: function () {
    this.$nextTick(function () {
      window.addEventListener('keydown', event => {
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
          event.preventDefault()
        }
      })
      window.addEventListener('keyup', event => {
        if (event.key === 'ArrowLeft') {
          this.setSlidePrevious()
        } else if (event.key === 'ArrowRight') {
          this.setSlideNext()
        } else if (event.key === 'ArrowUp') {
          this.setSongPrevious()
        } else if (event.key === 'ArrowDown') {
          this.setSongNext()
        } else if (event.ctrlKey && event.key === 'z') {
          this.setSongRandom()
        } else if (event.key === 'Escape') {
          this.showSearch()
        }
      })
    })
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
