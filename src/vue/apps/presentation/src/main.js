import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router.js'
import store from '@/store.js'
import { registerMasterComponents, masters } from '@/masters.js'
import shortcuts from '@bldr/vue-shortcuts'

import MaterialIcon from '@bldr/vue-component-material-icon'
import ModalDialog from '@bldr/vue-component-modal-dialog'
import DynamicSelect from '@bldr/vue-component-dynamic-select'
import media from '@bldr/vue-media'

Vue.use(shortcuts, router, store)
Vue.use(media, router, store)

Vue.use(DynamicSelect)
Vue.use(ModalDialog)
Vue.use(MaterialIcon)
Vue.config.productionTip = false

/******************************************************************************/

class BodyAttributes {
  constructor () {
    this.attributeName = ''
    this.state = false
  }

  toggle () {
    this.set(!this.state)
  }

  set (state = false) {
    if (typeof state !== 'boolean') {
      state = this.state
    }
    document.querySelector('body').setAttribute(this.attributeName, state)
    this.state = state
  }
}

class CenterVertically extends BodyAttributes {
  constructor () {
    super()
    this.attributeName = 'b-center-vertically'
    this.state = true
  }
}

class DarkMode extends BodyAttributes {
  constructor () {
    super()
    this.attributeName = 'b-dark-mode'
    this.state = false
  }
}

class Overflow extends BodyAttributes {
  constructor () {
    super()
    this.attributeName = 'b-overflow'
    this.state = true
  }
}

const slidePadding = {
  default: function () {
    document.querySelector('main #content').style.padding = null
  },
  set: function (padding) {
    document.querySelector('main #content').style.padding = padding
  },
  none: function () {
    document.querySelector('main #content').style.padding = 0
  }
}

class StyleConfig {
  constructor () {
    this.configObjects = {
      centerVertically: new CenterVertically(),
      darkMode: new DarkMode(),
      overflow: new Overflow(),
      slidePadding: slidePadding
    }
  }

  defaults_ () {
    return {
      centerVertically: true,
      darkMode: false,
      overflow: false,
      slidePadding: '2vw 8vw'
    }
  }

  setDefaults () {
    this.set_(this.defaults_())
  }

  set_ (styleConfig) {
    for (const config in styleConfig) {
      if (config in this.configObjects) {
        this.configObjects[config].set(styleConfig[config])
      } else {
        throw new Error(`Unkown style config “${config}”.`)
      }
    }
  }

  set (styleConfig) {
    if (!styleConfig) styleConfig = {}
    this.set_(Object.assign(this.defaults_(), styleConfig))
  }
}

Vue.prototype.$styleConfig = new StyleConfig()

/******************************************************************************/

Vue.prototype.$masters = masters

Vue.prototype.$fullscreen = function () {
  document.querySelector('#app').requestFullscreen()
}

// Must be before new Vue()
registerMasterComponents()

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
