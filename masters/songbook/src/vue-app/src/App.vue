<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/table-of-contents">Inhaltsverzeichnis</router-link>
    </div>
    <router-view/>
  </div>
</template>

<script>
import songs from '/home/jf/.local/share/baldr/projector/songs.json'
import { mapActions } from 'vuex'

export default {
  name: 'App',
  beforeCreate: function () {
    this.$store.dispatch('importSongs', songs)
  },
  methods: mapActions(['setSlideNext', 'setSlidePrevious']),
  mounted: function () {
    this.$nextTick(function () {
      window.addEventListener('keydown', event => {
        if (['ArrowLeft', 'ArrowRight'].includes(event.key)) {
          event.preventDefault()
        }
      })
      window.addEventListener('keyup', event => {
        if (event.key === 'ArrowLeft') {
          this.setSlidePrevious()
        } else if (event.key === 'ArrowRight') {
          this.setSlideNext()
        }
      })
    })
  }
}
</script>

<style>
@import '~@bldr/theme-default/styles-ng.css';
</style>
