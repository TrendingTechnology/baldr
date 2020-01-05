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
    <!-- <play-load-indicator/> -->
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
    /**
     * Toggle between to routes:
     *
     * 1. The route with the name `sides` and
     * 2. the route with the name specified with the argument
     *    `routeNameTo`.
     *
     * If the current route is neither `slides` nor `routeNameTo` move
     * to `routeNameTo`.
     *
     * @params {string} routeNameTo - The route name to move to or move
     *   from.
     */
    toggleSlidesRouteTo (routeNameTo) {
      if (this.$route.name !== routeNameTo) {
        this.$router.push({ name: routeNameTo })
      } else {
        this.$router.push({ name: 'slides' })
      }
    },
    getToggleShortcutObject (keys, routeNameTo) {
      return {
        keys: keys,
        callback: () => { this.toggleSlidesRouteTo(routeNameTo) },
        description: `Zwischen “slides” und “${routeNameTo}”  hin- und herschalten`
      }
    },
    getToggleShortcutObjects (toggleRouteSpecs) {
      const shortcutObjects = []
      for (const spec of toggleRouteSpecs) {
        shortcutObjects.push(this.getToggleShortcutObject(...spec))
      }
      return shortcutObjects
    }
  },
  mounted: function () {
    window.addEventListener('error', (event) => {
      this.$notifyError(event.error)
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
          this.$store.dispatch('presentation/reloadPresentation').then(() => {
            this.$notifySuccess('Die Präsentation wurde neu geladen.')
          })
        },
        // Reload presentation
        description: 'Präsentation neu laden'
      },
      {
        keys: 'ctrl+e',
        callback: () => {
          const presentation = this.$store.getters['presentation/presentation']
          if (Object.keys(presentation).length === 0) {
            this.$notifyError(
              'Es ist keine Präsentation geladen.',
              'Editor konnte nicht geöffnet werden.'
            )
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
            this.$notifyError(
              'Es ist keine Präsentation geladen.',
              'Der übergeordnete Ordner konnte nicht geöffnet werden.'
            )
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
      ...this.getToggleShortcutObjects([
        ['c', 'camera'],
        ['d', 'documentation'],
        ['e', 'editor'],
        ['h', 'home'],
        ['i', 'media-ids'],
        ['m', 'media-overview'],
        // p: is already taken by p f or p s
        ['l', 'slides-preview'],
        ['r', 'rest-api'],
        ['s', 'slides-overview']
      ]),
      {
        keys: 'ctrl+u',
        callback: async () => {
          try {
            const result = await this.$media.httpRequest.request('mgmt/update')
            this.$store.dispatch('presentation/updateFolderTitleTree')
            if (result.data.errors.length) {
              for (const errorMsg of result.data.errors) {
                this.$notifyError(errorMsg)
              }
            } else {
              this.$notifySuccess(`Der lokale Medien-Server wurde erfolgreich aktualisiert. Git-Commit-ID: ${result.data.lastCommitId.substring(0, 8)}`)
            }
          } catch (error) {
            this.$notifyError(error)
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

  /*********************************************************************
   * Master main components
   ********************************************************************/

  .main-app-padding {
    box-sizing: border-box;
    padding: 2vw 8vw;
  }

  .main-app-fullscreen {
    box-sizing: border-box;
    height: 100vh;
    width: 100vw;
  }

  /*********************************************************************
   * Master preview components
   ********************************************************************/

  /**
   * Applied to the top level preview div
   */

  // Fill the whole preview room
  .slide-preview-fullscreen {
    box-sizing: border-box;
    height: 100%;
    max-height: 100%;
    max-width: 100%;
    width: 100%;
  }

  // Center vertically and horizontally
  .slide-preview-valign-center {
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
  }

  // Show top content, hide bottom content on the preview slides.
  .slide-preview-valign-top {
    display: flex;
    flex-flow: column;
    overflow: hidden;
  }

  // generic, editor
  .slide-preview-fix-typography {
    text-align: left;
    padding: 1em;

    h1 {
      font-size: 1.2em;
    }

    h2 {
      font-size: 1.1em;
    }

    h3, h4 {
      font-size: 1em;
    }

    h1, h2, h3, h4 {
      margin: 0;
    }

    p {
      margin: 0;
    }

    ol, ul {
      padding-left: 0.5em;
    }
  }

  /**
   * Applied to <img>
   */

  // Show the whole image on the slide previews.
  .image-contain {
    height: 100%;
    object-fit: contain;
    width: 100%;
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
      font-family: $font-family-sans;
      font-size: 8vw;
      font-weight: bold;
      opacity: 1;
      text-align: center;
      vertical-align: middle;
    }
  }

  .vue-notification {
    background: #44A4FC;
    border-left: 0.5em solid #187FE7;
    color: #ffffff;
    font-size: 12pt;
    margin: 0 1em 1em;
    padding: 1em;

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

  .vc_play_load_indicator {
    position: fixed;
    bottom: 1vw;
    left: 1vw;
  }
</style>
