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
        <router-link :to="{ name: 'toc'}">
          <plain-icon name="table-of-contents"/>
          Inhaltsverzeichnis
        </router-link>
      </div>

      <div class="block">
        Anzahl der Lieder: {{ Object.keys(songs).length }}
      </div>

    </section>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'StartPage',
  data () {
    return {
      selectedSong: null
    }
  },
  computed: mapGetters(['library', 'songs']),
  methods: {
    selectSong () {
      this.$router.push(`song/${this.selectedSong.id}`)
    }
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
