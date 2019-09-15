import Vue from 'vue'
import App from './App.vue'
import router from './router'

import ModalDialog from '@bldr/vue-component-modal-dialog'
import DynamicSelect from '@bldr/vue-component-dynamic-select'
import MaterialIcon from '@bldr/vue-component-material-icon'
import shortcuts from '@bldr/vue-shortcuts'

Vue.config.productionTip = false

Vue.use(shortcuts)
Vue.use(DynamicSelect)
Vue.use(ModalDialog)
Vue.use(MaterialIcon)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
