import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import MaterialIcon from '@bldr/vue-component-material-icon'
import ModalDialog from '@bldr/vue-component-modal-dialog'
import DynamicSelect from '@bldr/vue-component-dynamic-select'

Vue.use(DynamicSelect)
Vue.use(ModalDialog)
Vue.use(MaterialIcon)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
