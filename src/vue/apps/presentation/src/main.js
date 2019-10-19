/**
 * @module @bldr/presentation
 */
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
Vue.use(media, router, store, Vue.prototype.$shortcuts)

Vue.use(DynamicSelect)
Vue.use(ModalDialog)
Vue.use(MaterialIcon)
Vue.config.productionTip = false

/******************************************************************************/

/**
 * Set multiple attributes at the same time
 */
class MultipleAttributes {

  constructor () {
    this.attributeName = ''
  }

  set (value) {
    const elements = document.querySelectorAll(`[${this.attributeName}]`)
    for (const element of elements) {
      element.attributes[this.attributeName].value = value
    }
  }
}

/**
 *
 */
class BodyAttributes {
  constructor () {
    this.attributeName = ''
    this.state = false
    this.bodyEl_ = document.querySelector('body')
  }

  toggle () {
    this.set(!this.state)
  }

  set (state = false) {
    this.bodyEl_.setAttribute(this.attributeName, state)
    this.state = state
  }
}

/**
 *
 */
class CenterVertically extends BodyAttributes {
  constructor () {
    super()
    this.attributeName = 'b-center-vertically'
    this.state = true
  }
}

/**
 *
 */
class DarkMode extends BodyAttributes {
  constructor () {
    super()
    this.attributeName = 'b-dark-mode'
    this.state = false
  }
}

/**
 *
 */
class Overflow extends BodyAttributes {
  constructor () {
    super()
    this.attributeName = 'b-overflow'
    this.state = true
  }
}

/**
 *
 */
class Theme extends BodyAttributes {
  constructor () {
    super()
    this.attributeName = 'b-theme'
    this.state = 'default'
  }
}

class ContentTheme extends MultipleAttributes {
  constructor () {
    super()
    this.attributeName = 'b-content-theme'
  }
}

class UiTheme extends MultipleAttributes {
  constructor () {
    super()
    this.attributeName = 'b-ui-theme'
  }
}

/**
 *
 */
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



/**
 *
 */
class StyleConfig {
  constructor () {
    this.configObjects = {
      centerVertically: new CenterVertically(),
      darkMode: new DarkMode(),
      overflow: new Overflow(),
      slidePadding: slidePadding,
      theme: new Theme(),
      contentTheme: new ContentTheme(),
      uiTheme: new UiTheme()
    }
  }

  defaults_ () {
    return {
      centerVertically: true,
      darkMode: false,
      overflow: false,
      slidePadding: '2vw 8vw',
      theme: 'default',
      contentTheme: 'default',
      uiTheme: 'default'
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

/**
 *
 */
Vue.prototype.$styleConfig = new StyleConfig()

/******************************************************************************/

/**
 *
 */
Vue.prototype.$masters = masters

// https://stackoverflow.com/a/45032366/10193818
Vue.prototype.$fullscreen = function () {
  document.documentElement.requestFullscreen()
}

// Must be before new Vue()
registerMasterComponents()

export default new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
