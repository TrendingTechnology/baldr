/**
 * @module @bldr/seating-plan
 */

import Vue from 'vue'
import App from './App.vue'
import dataStore from './data-store.js'
import VueRouter from 'vue-router'
import store from './store'

Vue.config.productionTip = false
Vue.use(VueRouter)
new Vue({
  store,
  data: function () {
    return {
      data: dataStore.data
    }
  },
  render: function (h) { return h(App) }
}).$mount('#app')
