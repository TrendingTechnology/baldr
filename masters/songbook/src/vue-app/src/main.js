import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ModalDialog from '@bldr/vue-component-modal'
import DynamicSelect from '@bldr/vue-component-dynamic-select'

Vue.use(ModalDialog)
Vue.use(DynamicSelect)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
