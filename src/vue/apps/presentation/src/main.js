import Vue from 'vue'
import App from './App.vue'
import router from './router.js'
import store from './store.js'
import { registerMasterComponents, masters } from './masters.js'

import MaterialIcon from '@bldr/vue-component-material-icon'
import ModalDialog from '@bldr/vue-component-modal-dialog'
import DynamicSelect from '@bldr/vue-component-dynamic-select'

Vue.use(DynamicSelect)
Vue.use(ModalDialog)
Vue.use(MaterialIcon)
Vue.config.productionTip = false

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

Vue.prototype.$centerVertically = new CenterVertically()

class DarkMode extends BodyAttributes {
  constructor () {
    super()
    this.attributeName = 'b-dark-mode'
    this.state = false
  }
}

Vue.prototype.$darkMode = new DarkMode()

Vue.prototype.$masters = masters

// Must be before new Vue()
registerMasterComponents()

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
