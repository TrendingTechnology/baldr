/**
 * @module @bldr/seating-plan
 */

import App from './App.vue'
import Notifications from 'vue-notification'
import Vue from 'vue'
import VueRouter from 'vue-router'

import store from './store'

Vue.config.productionTip = false

Vue.use(VueRouter)
Vue.use(Notifications)

new Vue({
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
