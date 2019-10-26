<template>
  <div class="vc_main_app">
    <router-view/>
    <app-info package-name="@bldr/songbook-vue-app" :version="version"/>
  </div>
</template>

<script>
/* globals songsJson */
import { mapActions } from 'vuex'
import { AppInfo } from '@bldr/vue-components-collection'

import packageJson from '../package.json'

export default {
  name: 'MainApp',
  components: {
    AppInfo
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
