<template>
  <div id="vc_main_app">
    <nav id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/typography">Typography</router-link> |
      <router-link to="/css-markup">CSS markup</router-link> |
      <router-link to="/colors">Colors</router-link> |
      <router-link to="/modal">Modal</router-link> |
      <router-link to="/dynamic-select">Dynamic select</router-link> |
      <router-link to="/material-icon">Material icon</router-link>
    </nav>
    <router-view/>
    <app-info package-name="@bldr/showroom" :version="version"/>
  </div>
</template>

<script lang="ts">
// import packageJson from '@/../package.json'
import { AppInfo } from '@bldr/components-collection'
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {
    AppInfo
  }
})
export default class MainApp extends Vue {
  get version (): string {
    return '1.1.1'
  }
}
</script>

<style>
main {
  margin: 2vw;
}
</style>
