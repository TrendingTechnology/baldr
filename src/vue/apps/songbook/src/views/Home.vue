<template>
  <div class="home">
    <h1>Liederbuch</h1>

    <dynamic-select
      class="dynamic-select-wrapper"
      placeholder="Suche nach einem Lied"
      :options="library.toDynamicSelect()"
      @input="selectSong"
      v-model="selectedSong"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Home',
  data () {
    return {
      selectedSong: null
    }
  },
  computed: mapGetters(['library']),
  methods: {
    selectSong () {
      this.$router.push(`song/${this.selectedSong.id}`)
    }
  }
}
</script>

<style lang="scss" scoped>
  h1 {
    text-align: center;
  }

  .dynamic-select-wrapper {
    margin: 1vw 10vw;
  }
</style>
