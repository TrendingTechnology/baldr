<template>
  <div class="vc_start_page">
    <h1>Liederbuch</h1>

    <dynamic-select
      class="dynamic-select-wrapper"
      placeholder="Suche nach einem Lied"
      :options="library.toDynamicSelect()"
      @input="selectSong"
      v-model="selectedSong"
    />

    <section class="row">
      <div class="block">
        <router-link :to="{ name: 'toc' }">
          <plain-icon name="table-of-contents" />
          Inhaltsverzeichnis
        </router-link>
      </div>

      <div class="block">
        Anzahl der Lieder: {{ Object.keys(songs).length }}
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { mapGetters } from 'vuex'
import { Vue, Component } from 'vue-property-decorator'

import {
  CoreLibrary,
  SongCollection,
  Song,
  DynamicSelectSong
} from '@bldr/songbook-core'

@Component({
  computed: {
    ...mapGetters(['library', 'songs'])
  }
})
export default class StartPage extends Vue {
  selectedSong!: DynamicSelectSong

  library!: CoreLibrary

  songs!: SongCollection<Song>

  selectSong () {
    this.$router.push(`song/${this.selectedSong.ref}`)
  }
}
</script>

<style lang="scss" scoped>
.vc_start_page {
  h1 {
    text-align: center;
  }

  .dynamic-select-wrapper {
    margin: 1vw 10vw;
  }

  .row {
    margin-top: 10vw;
    font-size: 3vw;
    display: flex;
    justify-content: center;
  }

  .block {
    width: 30vw;
  }
}
</style>
