import Vue from 'vue'
import App from './App.vue'
import dataStore from './data-store.js'
import VueRouter from 'vue-router'

Vue.config.productionTip = false
Vue.use(VueRouter)
new Vue({
  data: function () {
    return {
      data: dataStore.data
    }
  },
  render: function (h) { return h(App) }
}).$mount('#app')
