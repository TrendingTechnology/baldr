/**
 * Vue app to test the themes.
 *
 * @module @bldr/vue-app-showroom
 */

import Vue from 'vue'
import MainApp from './MainApp.vue'
import router from './router'
import Vuex from 'vuex'

import ModalDialog from '@bldr/vue-plugin-modal-dialog'
import DynamicSelect from '@bldr/vue-plugin-dynamic-select'
import MaterialIcon from '@bldr/vue-plugin-material-icon'
import shortcuts from '@bldr/vue-plugin-shortcuts'

Vue.config.productionTip = false

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: true
})

Vue.use(shortcuts, router, store)
Vue.use(DynamicSelect)
Vue.use(ModalDialog)
Vue.use(MaterialIcon)

new Vue({
  store,
  router,
  render: h => h(MainApp)
}).$mount('#app')
