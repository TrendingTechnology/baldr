import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import MaterialIcon from '@bldr/vue-component-material-icon'

Vue.config.productionTip = false

Vue.use(MaterialIcon)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
