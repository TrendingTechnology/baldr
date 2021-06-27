import Vue from 'vue'
import App from './App.vue'
import styleConfigurator from '@bldr/style-configurator'

Vue.use(styleConfigurator as any)

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
