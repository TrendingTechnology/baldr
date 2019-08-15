<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/table-of-contents">Inhaltsverzeichnis</router-link>
    </div>
    <router-view/>
    <footer>
      {{ compilationTime }}
      {{ compilationVersion }}
    </footer>
  </div>
</template>

<script>
/* globals compilationTime compilationVersion songsJson */
import { mapActions } from 'vuex'

export default {
  name: 'App',
  beforeCreate: function () {
    this.$store.dispatch('importSongs', songsJson)
  },
  methods: mapActions(['setSlideNext', 'setSlidePrevious']),
  data () {
    return {
      compilationVersion: compilationVersion,
      compilationTime: new Date(compilationTime).toLocaleString()
    }
  }
}
</script>

<style>
  @import '~@bldr/theme-default/styles-ng.css';

  body {
    margin: 0;
  }

  #nav {
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
