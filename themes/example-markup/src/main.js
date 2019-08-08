import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import CuteModal from '@bldr/vue-component-modal'

Vue.use(CuteModal)

new Vue({
  render: h => h(App)
}).$mount('#app')
