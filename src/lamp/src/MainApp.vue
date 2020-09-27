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

    <app-info
      package-name="@bldr/lamp"
      :version="version"
    />

    <!-- A fullscreen overlay to display videos or images in fullscreen -->
    <media-canvas/>
    <media-player/>
  </div>
</template>

<script>
import packageJson from '@/../package.json'
import { AppInfo } from '@bldr/components-collection'
import { receiveSocketMessage } from '@/remote-control.js'
import actions from './actions.js'
import menuTemplate, { traverseMenu, normalizeKeyboardShortcuts } from './menu.js'
import { hideMouseAfterSec } from './lib.js'

import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapGetters } = createNamespacedHelpers('lamp')

export default {
  name: 'MainApp',
  components: {
    AppInfo
  },
  computed: {
    version () {
      return packageJson.version
    },
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

    hideMouseAfterSec(3)
  }
}
</script>

<style lang="scss">
  @import "./global-styles.scss";
</style>
