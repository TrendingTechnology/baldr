<template>
  <div id="app">
    <router-view/>
    <compilation-info package-name="@bldr/songbook-vue-app" :version="version"/>
  </div>
</template>

<script>
/* globals songsJson */
import { mapActions } from 'vuex'
import { CompilationInfo } from '@bldr/vue-components'

import packageJson from '../package.json'

export default {
  name: 'App',
  components: {
    CompilationInfo
  },
  data () {
    return {
      version: packageJson.version
    }
  },
  beforeCreate: function () {
    this.$store.dispatch('importSongs', songsJson)
  },
  methods: mapActions(['setSlideNext', 'setSlidePrevious'])
}
</script>

<style lang="scss">
  @import '~@bldr/theme-default/styles-ng.css';

  body {
    margin: 0;
    font-size: 2vw;
    background-color: $white;
  }

  #nav {
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
