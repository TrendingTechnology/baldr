/**
 * @module @bldr/seating-plan
 */

import App from './App.vue'
import Vue from 'vue'
import VueRouter from 'vue-router'

import store from './store'
import router from './router'
import ModalDialog from '@bldr/vue-component-modal'
import DynamicSelect from '@bldr/vue-component-dynamic-select'
import MaterialIcon from '@bldr/vue-component-material-icon'

Vue.config.productionTip = false

Vue.use(VueRouter)
Vue.use(ModalDialog)
Vue.use(DynamicSelect)
Vue.use(MaterialIcon)

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
