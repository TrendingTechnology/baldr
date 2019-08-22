<template>
  <div id="app">
      <modal-dialog name="menu">
        <main-menu/>
      </modal-dialog>
    <main>
      <div id='content'>
        <router-view/>
      </div>
    </main>
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
        } else if (event.ctrlKey && event.key === 'd') {
          // edit bookmarks
          event.preventDefault()
        }
      })

      window.addEventListener('keyup', event => {
        if (event.ctrlKey && event.key === 'm') {
          this.$modal.toggle('menu')
        } else if (event.ctrlKey && event.key === 'd') {
          this.$darkMode.toggle()
        } else if (event.ctrlKey && event.altKey && event.key === 'v') {
          this.$centerVertically.toggle()
        }
      })
    })
  }
}
</script>
<style lang="scss">
  @import '~@bldr/theme-default/styles-ng.css';

  body {
    margin: 0;
  }

  /* Every root element in each view should be main. */
  main {
    font-size: 4vw;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
  }

 [b-center-vertically="true"] {
    main {
      display: table;
    }

    #content {
      display: table-cell;
      vertical-align: middle;
      height: 100%;
    }
  }

  [data-margin="true"] #slide-content {
    padding: 5vw;
  }

</style>
