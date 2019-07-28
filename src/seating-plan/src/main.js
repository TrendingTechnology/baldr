/**
 * @module @bldr/seating-plan
 */

import App from './App.vue'
import Vue from 'vue'
import VueRouter from 'vue-router'

import store from './store'

Vue.config.productionTip = false

Vue.use(VueRouter)

new Vue({
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
