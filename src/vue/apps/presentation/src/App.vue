<template>
  <div id="app">
      <modal-dialog name="menu">
        <main-menu/>
      </modal-dialog>
    <router-view/>
    <app-info package-name="@bldr/showroom" :version="version"/>
  </div>
</template>

<script>
import packageJson from '@/../package.json'
import { AppInfo } from '@bldr/vue-components-collection'
import MainMenu from '@/components/MainMenu'

export default {
  name: 'app',
  components: {
    AppInfo,
    MainMenu
  },
  computed: {
    version () {
      return packageJson.version
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      window.addEventListener('keydown', event => {
        if (event.ctrlKey && event.key === 'm') {
          // Disable Mute audio
          event.preventDefault()
        }
      })

      window.addEventListener('keyup', event => {
        if (event.ctrlKey && event.key === 'm') {
          this.$modal.toggle('menu')
        }
      })
    })
  }
}
</script>
<style lang="css">
  @import '~@bldr/theme-default/styles-ng.css';

  body {
    font-size: 1em;
  }
</style>
