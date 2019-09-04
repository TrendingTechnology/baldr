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
import { mapActions } from 'vuex'

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
  methods: mapActions(['setSlidePrevious', 'setSlideNext']),
  created: function () {
    this.$store.dispatch('findMediaServer')
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
        } else if (['ArrowLeft', 'ArrowRight'].includes(event.key)) {
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
        } else if (event.key === 'ArrowLeft') {
          this.setSlidePrevious()
        } else if (event.key === 'ArrowRight') {
          this.setSlideNext()
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

  main {
    font-size: 4vw;
    height: 100vh;
    width: 100vw;
    overflow: hidden;

    #content {
      padding: 2vw 8vw;
    }
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
</style>
