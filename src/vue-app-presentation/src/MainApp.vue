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
          <div class="title">{{props.item.title}}</div>
          <div class="text" v-html="props.item.text"/>
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
    <app-info package-name="@bldr/vue-app-presentation" :version="version"/>
  </div>
</template>

<script>
import packageJson from '@/../package.json'
import { AppInfo } from '@bldr/vue-plugin-components-collection'
import MainMenu from '@/components/MainMenu'
import { openFiles } from '@/content-file.js'
import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('presentation')

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
    },
    toggleSlidesOverview () {
      if (this.$route.name === 'slides') {
        this.$router.push({ name: 'slides-overview' })
      } else if (this.$route.name === 'slides-overview') {
        this.$router.push({ name: 'slides' })
      }
    }
  },
  mounted: function () {
    window.addEventListener('error', (event) => {
      this.$notify({
        group: 'default',
        title: event.error.message,
        text: `filename: ${event.error.fileName}`,
        duration: 5000,
        type: 'error'
      })
    })
    this.$styleConfig.set({ overflow: true })
    this.$shortcuts.addMultiple([
      {
        keys: 'left',
        callback: this.setSlidePrevious,
        // Previous slide
        description: 'zur vorhergehenden Folie',
        routeNames: ['slides']
      },
      {
        keys: 'right',
        callback: this.setSlideNext,
        // Next slide
        description: 'zur nächsten Folie',
        routeNames: ['slides']
      },
      {
        keys: 'up',
        callback: this.setStepPrevious,
        // Previous step
        description: 'zur vorhergehenden Unterfolie',
        routeNames: ['slides']
      },
      {
        keys: 'down',
        callback: this.setStepNext,
        // Next step
        description: 'zur nächsten Unterfolie',
        routeNames: ['slides']
      },
      {
        keys: 'ctrl+m',
        callback: () => { this.$modal.toggle('menu') },
        // Main menu
        description: 'Menü anzeigen'
      },
      {
        keys: 'ctrl+r',
        callback: () => {
          this.$store.dispatch('presentation/reloadPresentation')
        },
        // Reload presentation
        description: 'Präsentation neu laden'
      },
      {
        keys: 'ctrl+e',
        callback: () => {
          const presentation = this.$store.getters['presentation/presentation']
          if (Object.keys(presentation).length === 0) {
            this.$notify({
              group: 'default',
              type: 'error',
              title: 'Editor konnte nicht geöffnet werden.',
              text: 'Es ist keine Präsentation geladen.'
            })
            return
          }
          this.$media.httpRequest.request({
            url: 'mgmt/open',
            params: {
              with: 'editor',
              type: 'presentations',
              id: presentation.meta.id
            }
          })
        },
        description: 'Die aktuelle Präsentation im Editor öffnen'
      },
      {
        keys: 'ctrl+alt+e',
        callback: () => {
          const presentation = this.$store.getters['presentation/presentation']
          if (Object.keys(presentation).length === 0) {
            this.$notify({
              group: 'default',
              type: 'error',
              title: 'Der übergeordnete Ordner konnte nicht geöffnet werden.',
              text: 'Es ist keine Präsentation geladen.'
            })
            return
          }
          this.$media.httpRequest.request({
            url: 'mgmt/open',
            params: {
              with: 'folder',
              type: 'presentations',
              id: presentation.meta.id
            }
          })
        },
        description: 'Den übergeordneten Ordner der Präsentation öffnen'
      },
      {
        keys: 'ctrl+alt+d',
        callback: () => { this.$styleConfig.configObjects.darkMode.toggle() },
        // Dark mode
        description: 'Dark mode'
      },
      {
        keys: 'ctrl+alt+v',
        callback: () => { this.$styleConfig.configObjects.centerVertically.toggle() },
        // center vertically
        description: 'Vertikal zentrieren'
      },
      {
        keys: 'ctrl+alt+s',
        callback: () => { this.$styleConfig.setDefaults() },
        // set style config defaults'
        description: 'Standard-Darstellung'
      },
      {
        keys: 'ctrl+f',
        callback: this.$fullscreen,
        // Fullscreen
        description: 'Vollbild'
      },
      {
        keys: 'return',
        callback: this.toggleSlidesOverview,
        description: 'Zwischen Folien und Folien-Überblick hin- und herschalten',
        routeNames: ['slides', 'slides-overview']
      },
      {
        keys: 'ctrl+u',
        callback: async () => {
          try {
            const result = await this.$media.httpRequest.request('mgmt/update')
            if (result.data.errors.length) {
              for (const errorMsg of result.data.errors) {
                this.$notify({
                  group: 'default',
                  type: 'error',
                  text: errorMsg,
                  duration: -1 // forever
                })
              }
            } else {
              this.$notify({
                group: 'default',
                type: 'success',
                text: `Der lokale Medien-Server wurde erfolgreich aktualisiert. Git-Commit-ID: ${result.data.lastCommitId.substring(0, 8)}`
              })
            }
          } catch (error) {
            this.$notify({
              group: 'default',
              type: 'error',
              text: error.message
            })
          }
        },
        description: 'Lokalen Medienserver aktualisieren.'
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

    font-size: 12pt;

    color: #ffffff;
    background: #44A4FC;
    border-left: 0.5em solid #187FE7;

    .text {
      font-size: 0.8em;
    }

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