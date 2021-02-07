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

    <!-- Main area managed by the Vue router. -->
    <main>
      <router-view/>
    </main>

    <!-- A fullscreen overlay to display videos or images in fullscreen -->
    <media-canvas/>
    <media-player/>
  </div>
</template>

<script>
import { receiveSocketMessage } from '@/remote-control.js'
import actions from './actions.js'
import menuTemplate, { traverseMenu, normalizeKeyboardShortcuts } from './menu.js'
import { hideMouseAfterSec } from './lib.js'

import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapGetters } = createNamespacedHelpers('lamp')

export default {
  name: 'MainApp',
  computed: {
    ...mapGetters(['slide', 'presentation'])
  },
  methods: {
    ...mapActions([
      'setSlideNextOrPrevious',
      'setStepNextOrPrevious',
      'setSlideOrStepNextOrPrevious'
    ])
  },
  mounted: function () {
    // https://github.com/SimulatedGREG/electron-vue/issues/394#issuecomment-329989627
    // see preload.js
    if (window.ipcRenderer) {
      window.ipcRenderer.on('navigate', (e, route) => {
        this.$router.push(route)
      })

      window.ipcRenderer.on('action', (e, name) => {
        if (actions[name] && typeof actions[name] === 'function') {
          actions[name]()
        } else {
          throw new Error(`Unkown action name ${name}`)
        }
      })
    }
    window.addEventListener('error', (event) => {
      this.$notifyError(event.error)
    })
    const registerMenuItem = (raw) => {
      let action
      if (!raw.keyboardShortcut) return
      if (raw.action === 'executeCallback') {
        action = actions[raw.arguments]
      } else if (raw.action === 'pushRouter') {
        action = () => {
          this.$router.push({ name: raw.arguments })
        }
      } else if (raw.action === 'openExternalUrl') {
        action = () => {
          window.open(raw.arguments, '_blank')
        }
      } else {
        throw new Error(`Unkown action for raw menu entry: ${raw.label}`)
      }
      this.$shortcuts.add(normalizeKeyboardShortcuts(raw.keyboardShortcut), action, raw.label, raw.activeOnRoutes)
    }

    traverseMenu(menuTemplate, registerMenuItem)

    this.$router.afterEach((to, from) => {
      if (to.meta.style) {
        this.$styleConfig.set(to.meta.style)
      }
    })

    this.$options.sockets.onmessage = receiveSocketMessage

    // Register Auto hide of the mouse.
    hideMouseAfterSec(3)

    // Update the media server on startup.
    // setTimeout(() => {
    //   actions.update()
    // }, 2000)
  }
}
</script>

<style lang="scss">
  @import "./global-styles.scss";

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
  }

</style>
