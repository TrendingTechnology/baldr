import Vue from 'vue'
import App from './App.vue'
import router from './router'

import ModalDialog from '@bldr/vue-component-modal'
import DynamicSelect from '@bldr/vue-component-dynamic-select'
import MaterialIcon from '@bldr/vue-component-material-icon'

Vue.use(DynamicSelect)
Vue.use(ModalDialog)
Vue.use(MaterialIcon)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
