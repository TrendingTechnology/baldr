import Vue from 'vue'
import App from './App.vue'
import router from './router'

import ModalDialog from '@bldr/vue-component-modal'

Vue.config.productionTip = false

Vue.use(ModalDialog)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
