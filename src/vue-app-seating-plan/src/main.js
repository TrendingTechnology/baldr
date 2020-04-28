/**
 * Seating plan app of the baldr project.
 *
 * @module @bldr/vue-app-seating-plan
 */

import App from './App.vue'
import Vue from 'vue'
import VueRouter from 'vue-router'

import store from './store'
import router from './router'
import ModalDialog from '@bldr/vue-plugin-modal-dialog'
import DynamicSelect from '@bldr/vue-plugin-dynamic-select'
import MaterialIcon from '@bldr/icons'
import shortcuts from '@bldr/shortcuts'

Vue.config.productionTip = false

Vue.use(VueRouter)
Vue.use(ModalDialog)
Vue.use(DynamicSelect)
Vue.use(MaterialIcon)
Vue.use(shortcuts, router, store)

Vue.prototype.$fullscreen = function () {
  document.querySelector('#app').requestFullscreen()
}

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
