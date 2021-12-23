<template>
  <div class="vc_main_app">
    <!-- vue-notifications -->
    <notifications group="default" position="top right">
      <template slot="body" slot-scope="props">
        <div
          b-ui-theme="default"
          :class="['vue-notification', props.item.type]"
          @click="props.close"
        >
          <div class="title">{{ props.item.title }}</div>
          <div class="text" v-html="props.item.text" />
        </div>
      </template>
    </notifications>

    <!-- Main area managed by the Vue router. -->
    <main>
      <router-view />
    </main>

    <!-- A fullscreen overlay to display videos or images in fullscreen -->
    <media-canvas />
    <media-player />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { createNamespacedHelpers } from 'vuex'

import { registerShortcuts } from '@bldr/menu-adapter'
import { styleConfigurator } from '@bldr/style-configurator'

import { receiveSocketMessage } from '../../remote-control.js'
import actions from '../../actions.js'

const { mapActions, mapGetters } = createNamespacedHelpers('lamp')

/**
 * Hide the mouse after x seconds of inactivity.
 */
export function hideMouseAfterSec (seconds: number = 5): void {
  let mouseTimer = null
  let cursorVisible = true

  function disappearCursor () {
    mouseTimer = null
    document.body.style.cursor = 'none'
    cursorVisible = false
  }

  document.onmousemove = function () {
    if (mouseTimer) {
      window.clearTimeout(mouseTimer)
    }
    if (!cursorVisible) {
      document.body.style.cursor = 'default'
      cursorVisible = true
    }
    mouseTimer = window.setTimeout(disappearCursor, seconds * 1000)
  }
}

@Component({
  computed: mapGetters(['slide', 'presentation']),
  methods: mapActions([
    'setSlideNextOrPrevious',
    'setStepNextOrPrevious',
    'setSlideOrStepNextOrPrevious'
  ])
})
export default class MainApp extends Vue {
  mounted () {
    // https://github.com/SimulatedGREG/electron-vue/issues/394#issuecomment-329989627
    // see preload.js
    if (window.api != null) {
      window.api.ipcRendererOn('navigate', route => {
        this.$router.push(route)
      })

      window.api.ipcRendererOn('action', name => {
        if (actions[name] && typeof actions[name] === 'function') {
          actions[name]()
        } else {
          throw new Error(`Unkown action name ${name}`)
        }
      })
    }
    window.addEventListener('error', event => {
      this.$showMessage.error(event.error)
    })
    registerShortcuts(this.$router, this.$shortcuts, actions)

    this.$router.afterEach((to, from) => {
      if (to.meta.style) {
        styleConfigurator.set(to.meta.style)
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
@import '@/global-styles.scss';

.vc_main_app {
  .vue-notification {
    background: #44a4fc;
    border-left: 0.5em solid #187fe7;
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
