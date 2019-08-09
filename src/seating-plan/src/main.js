/**
 * @module @bldr/seating-plan
 */

import App from './App.vue'
import Vue from 'vue'
import VueRouter from 'vue-router'

import store from './store'
import router from './router'
import ModalDialog from '@bldr/vue-component-modal'

Vue.config.productionTip = false

Vue.use(VueRouter)
Vue.use(ModalDialog)

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
