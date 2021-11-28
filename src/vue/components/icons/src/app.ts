import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

import App from '@/components/App.vue'
import Home from '@/components/Home.vue'
import AllStyles from '@/components/AllStyles.vue'
import AllIcons from '@/components/AllIcons.vue'

Vue.config.productionTip = false

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/icons',
    name: 'All Icons',
    component: AllIcons
  },
  {
    path: '/styles',
    name: 'All Styles',
    component: AllStyles
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
