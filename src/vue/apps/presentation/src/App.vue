<template>
  <div id="app" @drop.prevent="dropHandler" @dragover.prevent>
      <modal-dialog name="menu">
        <main-menu/>
      </modal-dialog>
    <main>
      <div id='content'>
        <router-view/>
      </div>
    </main>
    <media-player/>
    <app-info package-name="@bldr/presentation" :version="version"/>
  </div>
</template>

<script>
import packageJson from '@/../package.json'
import { AppInfo } from '@bldr/vue-components-collection'
import MainMenu from '@/components/MainMenu'
import { mapActions } from 'vuex'
import { openFiles } from '@/content-file.js'

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
  methods: {
    ...mapActions(['setSlidePrevious', 'setSlideNext', 'setStepPrevious', 'setStepNext']),
    dropHandler (event) {
      openFiles(event.dataTransfer.files)
    }
  },
  mounted: function () {
    this.$styleConfig.set({ overflow: true })
    this.$shortcuts.addMultiple([
      {
        keys: 'left',
        callback: () => { this.setSlidePrevious() },
        description: 'Previous slide'
      },
      {
        keys: 'right',
        callback: () => { this.setSlideNext() },
        description: 'Next slide'
      },
      {
        keys: 'up',
        callback: () => { this.setStepPrevious() },
        description: 'Previous stop'
      },
      {
        keys: 'down',
        callback: () => { this.setStepNext() },
        description: 'Next step'
      },
      {
        keys: 'ctrl+m',
        callback: () => { this.$modal.toggle('menu') },
        description: 'Main menu'
      },
      {
        keys: 'ctrl+alt+d',
        callback: () => { this.$styleConfig.configObjects.darkMode.toggle() },
        description: 'Dark mode'
      },
      {
        keys: 'ctrl+alt+v',
        callback: () => { this.$styleConfig.configObjects.centerVertically.toggle() },
        description: 'center vertically'
      },
      {
        keys: 'ctrl+alt+s',
        callback: () => { this.$styleConfig.setDefaults() },
        description: 'set style config defaults'
      },
      {
        keys: 'ctrl+f',
        callback: () => { this.$fullscreen() },
        description: 'Fullscreen'
      }
    ])
  }
}
</script>
<style lang="scss">
  @import '~@bldr/theme-default/styles.css';

  body {
    margin: 0;
  }

  main {
    font-size: 4vw;
    height: 100vh;
    width: 100vw;

    #content {
      padding: 2vw 8vw;
    }
  }

  [b-overflow="true"] {
    main {
      overflow: hidden;
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
