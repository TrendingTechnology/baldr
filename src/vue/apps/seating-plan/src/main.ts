/**
 * Seating plan app of the baldr project.
 *
 * @module @bldr/seating-plan
 */

// Make sure to register before importing any components
import './class-component-hooks'

import Vue from 'vue'
import VueRouter from 'vue-router'

import App from './App.vue'

import store from './store/index.js'
import router from './router'
import ModalDialog from '@bldr/modal-dialog'
import DynamicSelect from '@bldr/dynamic-select'
import MaterialIcon from '@bldr/icons'
import shortcuts from '@bldr/shortcuts'

Vue.config.productionTip = false

Vue.use(VueRouter)
Vue.use(ModalDialog)
Vue.use(DynamicSelect)
Vue.use(MaterialIcon)
Vue.use(shortcuts, router, store)

Vue.prototype.$fullscreen = function () {
  document.querySelector('#app')!.requestFullscreen()
}

new Vue({
  router,
  store,
  render: function (h) {
    return h(App)
  }
}).$mount('#app')
