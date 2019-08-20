<template>
  <div id="app">
    lol
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/overview">Overview</router-link>
    </div>
    <router-view/>
    <app-info package-name="@bldr/showroom" :version="version"/>

  </div>
</template>

<script>
import packageJson from '@/../package.json'
import { AppInfo } from '@bldr/vue-components-collection'

export default {
  name: 'app',
  components: {
    AppInfo
  },
  computed: {
    version () {
      return packageJson.version
    }
  }
}
</script>

<style lang="scss">
  @import '~@bldr/theme-default/styles-ng.css';

  body {
    font-size: 1em;
  }
</style>
