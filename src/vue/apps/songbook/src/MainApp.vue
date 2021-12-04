<template>
  <div class="vc_main_app">
    <router-view />
    <app-info package-name="@bldr/songbook" :version="version" />
  </div>
</template>

<script>
/* globals songsJson */
import { mapActions } from '@bldr/vue-packages-bundler'
import { AppInfo } from '@bldr/components-collection'

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
  methods: mapActions(['setSlideNext', 'setSlidePrevious']),
  mounted: function () {
    this.$shortcuts.addMultiple([
      {
        keys: 'f',
        callback: () => {
          this.$fullscreen()
        },
        description: 'Vollbild anzeigen'
      }
    ])
  }
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
