import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ModalDialog from '@bldr/vue-component-modal-dialog'
import DynamicSelect from '@bldr/vue-component-dynamic-select'
import MaterialIcon from '@bldr/vue-component-material-icon'

Vue.use(MaterialIcon)
Vue.use(ModalDialog)
Vue.use(DynamicSelect)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
