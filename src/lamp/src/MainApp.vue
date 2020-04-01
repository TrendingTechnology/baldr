<template>
  <div
    class="vc_main_app"
  >

    <!-- vue-notifications -->
    <notifications
      group="default"
      position="top right"
    >
      <template slot="body" slot-scope="props">
        <div
          b-ui-theme="default"
          :class="['vue-notification', props.item.type]"
          @click="props.close"
        >
          <div class="title">{{props.item.title}}</div>
          <div class="text" v-html="props.item.text"/>
        </div>
      </template>
    </notifications>

    <!-- Modal dialog (vue-plugin-modal-dialog) -->
    <modal-dialog name="menu">
      <main-menu/>
    </modal-dialog>

    <!-- Main area managed by the Vue router. -->
    <main>
      <router-view/>
    </main>

    <app-info
      package-name="@bldr/lamp"
      :version="version"
    />

    <!-- A fullscreen overlay to display videos or images in fullscreen -->
    <media-canvas/>
  </div>
</template>

<script>
import packageJson from '@/../package.json'
import { AppInfo } from '@bldr/vue-plugin-components-collection'

import MainMenu from '@/components/MainMenu'
import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapGetters } = createNamespacedHelpers('presentation')

export default {
  name: 'MainApp',
  components: {
    AppInfo,
    MainMenu
  },
  computed: {
    version () {
      return packageJson.version
    },
    ...mapGetters(['slideCurrent'])
  },
  methods: {
    ...mapActions([
      'setSlideNextOrPrevious',
      'setStepNextOrPrevious',
      'setSlideOrStepNextOrPrevious',
    ]),
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
    },
    callOpenRestApi (openWith, archive, create) {
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
          with: openWith,
          type: 'presentations',
          id: presentation.meta.id,
          archive,
          create
        }
      })
    }
  },
  mounted: function () {
    window.addEventListener('error', (event) => {
      this.$notifyError(event.error)
    })
    this.$styleConfig.set({ overflow: true })
    this.$shortcuts.addMultiple([
      {
        keys: 'ctrl+left',
        callback: () => this.setSlideNextOrPrevious(-1),
        // Previous slide
        description: 'zur vorhergehenden Folie',
        routeNames: ['slides']
      },
      {
        keys: 'ctrl+right',
        callback: () => this.setSlideNextOrPrevious(1),
        // Next slide
        description: 'zur nächsten Folie',
        routeNames: ['slides']
      },
      {
        keys: 'ctrl+up',
        callback: () => this.setStepNextOrPrevious(-1),
        // Previous step
        description: 'zum vorhergehenden Schritt',
        routeNames: ['slides']
      },
      {
        keys: 'ctrl+down',
        callback: () => this.setStepNextOrPrevious(1),
        // Next step
        description: 'zum nächsten Schritt',
        routeNames: ['slides']
      },
      {
        keys: 'left',
        callback: () => this.setSlideOrStepNextOrPrevious(-1),
        description: 'zur/m vorhergehenden Folie oder Schritt',
        routeNames: ['slides']
      },
      {
        keys: 'right',
        callback: () => this.setSlideOrStepNextOrPrevious(1),
        description: 'zur/m nächsten Folie oder Schritt',
        routeNames: ['slides']
      },
      {
        keys: 'ctrl+m',
        callback: () => { this.$modal.toggle('menu') },
        // Main menu
        description: 'Menü anzeigen'
      },
      {
        keys: 'ctrl+i',
        callback: () => { this.$store.dispatch('presentation/toggleMetaDataOverlay') },
        description: 'Metainformation der Folien ein/ausblenden'
      },
      {
        keys: 'ctrl+r',
        callback: async () => {
          try {
            await this.$store.dispatch('presentation/reloadPresentation')
            this.$notifySuccess('Die Präsentation wurde neu geladen.')
          } catch (error) {
            this.$notifyError(error)
          }
        },
        // Reload presentation
        description: 'Präsentation neu laden'
      },
      {
        keys: 'ctrl+e',
        callback: () => { this.callOpenRestApi('editor') },
        description: 'Die aktuelle Präsentation im Editor öffnen'
      },
      {
        keys: 'ctrl+a',
        callback: () => {
          if (this.slideCurrent && this.slideCurrent.firstMediaUri) {
            const uri = this.slideCurrent.firstMediaUri.split(':')[1]
            this.$media.httpRequest.request({
              url: 'mgmt/open',
              params: {
                with: 'editor',
                type: 'assets',
                id: uri
              }
            })
          } else {
            this.$notifyError('Die aktuelle Folie hat keine Mediendatei zum Öffnen.')
          }
        },
        description: 'Die erste Mediendatei der aktuellen Folien im Editor öffnen.'
      },
      {
        keys: 'ctrl+alt+e',
        callback: () => { this.callOpenRestApi('folder') },
        description: 'Den übergeordneten Ordner der Präsentation öffnen'
      },
      {
        keys: 'ctrl+shift+alt+e',
        callback: () => { this.callOpenRestApi('folder', true) },
        description: 'Den übergeordneten Ordner der Präsentation, sowie den dazugehörenden Archivordner öffnen'
      },
      {
        keys: 'ctrl+alt+r',
        callback: () => {
          this.callOpenRestApi('folder', true, true)
          this.callOpenRestApi('editor')
        },
        description: 'Vollständiger Editiermodus: Den übergeordneten Ordner der Präsentation, sowie den dazugehörenden Archivordner, als auch den Editor öffnen'
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
        // Take by image quick launcher i 1 etc...
        //['i', 'media-ids'],
        ['m', 'media-overview'],
        // p: is already taken by p f or p s
        ['s', 'slides-preview'],
        ['r', 'rest-api'],
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
      },
      {
        keys: 'ctrl+y',
        callback: () => {
            this.$store.dispatch('presentation/setSlideNoToOld')
        },
        description: 'Zwischen zwei Folien hin- und herschalten.'
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

  .active {
    background-color: rgba($yellow, 0.2) !important;
  }

  /*********************************************************************
   * Used in the Presentation.baldr.yml files
   ********************************************************************/

  // On task slides
  // Smaller font and text align left
  .note {
    font-size: 0.7em;
    text-align: left;
  }

  // For text overlays
  .transparent-background {
    background: rgba($gray, 0.2);
    margin: 0;
    box-sizing: border-box;
  }

  // Fix white text over white image areas
  .font-shadow {
    text-shadow: 0 0 0.1em $black;
  }

  // For master slides: person, instrument
  .img-contain {
    height: 100%;
    left: 0;
    object-fit: contain;
    object-position: left bottom;
    position: absolute;
    top: 0;
    width: 100%;
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
    overflow-x: hidden;
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

  #global-zone {
    #camera-master-video {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 5;
      width: 100vw;
      height: 100vh;
    }
  }


/***********************************************************************
 * Inline media
 **********************************************************************/

  .inline-media {
    display: table;
    margin: 0;
    margin-left: auto;
    margin-right: auto;
    text-align: center;

    img {
      width: 100%;
    }
  }

  .inline-media > * {
    display: block;
    max-width: 100%;
  }

  .inline-media > figcaption {
    caption-side: bottom;
    display: table-caption;
    font-size: 0.6em;
    margin-top: 0.5em;
    max-width: none;
    text-align: center;
  }

  .inline-left, .inline-right {
    width: 40%;
  }

  .inline-left {
    float: left;
    margin-left: 0;
    margin-right: 1em;
  }

  .inline-right {
    float: right;
    margin-left: 1em;
    margin-right: 0;
  }

/***********************************************************************
 * Main app specific
 **********************************************************************/

  .vc_main_app {
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
  }
</style>
