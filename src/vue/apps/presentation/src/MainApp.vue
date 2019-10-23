<template>
  <div
    @dragend="hideDragzone"
    @dragleave="hideDragzone"
    @dragover.prevent="showDragzone"
    @drop.prevent="dropHandler"
    class="vc_main_app"
  >
    <!-- <notifications group="default"/> -->
    <notifications
      group="default"
      position="top right"
    >
      <template slot="body" slot-scope="props">
        <div b-ui-theme="default" :class="['vue-notification', props.item.type]" @click="props.close">
          <a class="title">{{props.item.title}}</a>
          <div v-html="props.item.text"/>
        </div>
      </template>
    </notifications>
    <div ref="dropzone" id="dropzone" b-ui-theme="default">
      <div class="message">
        Medien-Dateien oder eine Präsentation öffnen durch „Drag-and-Drop“ ...
      </div>
    </div>
    <modal-dialog name="menu">
      <main-menu/>
    </modal-dialog>
    <main>
      <router-view/>
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
  name: 'MainApp',
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
      this.hideDragzone()
    },
    showDragzone (event) {
      this.$refs.dropzone.style.display = 'table'
    },
    hideDragzone (event) {
      this.$refs.dropzone.style.display = 'none'
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
        keys: 'ctrl+r',
        callback: () => {
          console.log('reload')
          this.$store.dispatch('reloadPresentation')
        },
        description: 'Reload presentation'
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
    this.$router.afterEach((to, from) => {
      if ('style' in to.meta) {
        this.$styleConfig.set(to.meta.style)
      }
    })
  }
}
</script>

<style lang="scss">
  body {
    margin: 0;
  }

  .default-padding {
    box-sizing: border-box;
    padding: 2vw 8vw;
  }
</style>

<style lang="scss" scoped>
  #dropzone {
    background: $blue;
    border: 1vw dashed scale-color($blue, $lightness: -40%);
    box-sizing: border-box;
    display: none;
    height: 100vh;
    left: 0;
    opacity: 0.7;
    position: fixed;
    top: 0;
    width: 100vw;
    z-index: 99999;

    .message {
      display: table-cell;
      vertical-align: middle;
      text-align: center;
      font-size: 8vw;
      font-weight: bold;
      font-family: $font-family-sans;
      opacity: 1;
    }
  }

  .vue-notification {
    padding: 1em;
    margin: 0 1em 1em;

    font-size: 2vw;

    color: #ffffff;
    background: #44A4FC;
    border-left: 0.5em solid #187FE7;

    &.warn {
      background: scale-color($orange, $lightness: 40%);
      border-left-color: $orange;
    }

    &.error {
      background: scale-color($red, $lightness: 40%);
      border-left-color: $red;
    }

    &.success {
      background: scale-color($green, $lightness: 40%);
      border-left-color: $green;
    }
  }
</style>