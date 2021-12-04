import { Vue, VueRouter, RouteConfig } from '@bldr/vue-packages-bundler'

import App from '@/components/app/App.vue'
import Home from '@/components/app/Home.vue'
import AllStyles from '@/components/app/AllStyles.vue'
import AllIcons from '@/components/app/AllIcons.vue'
import Link from '@/components/app/Link.vue'
import VanishDemonstration from '@/components/app/VanishDemonstration.vue'

Vue.config.productionTip = false

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/icons',
    component: AllIcons
  },
  {
    path: '/styles',
    component: AllStyles
  },
  {
    path: '/link',
    component: Link
  },
  {
    path: '/vanish',
    component: VanishDemonstration
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
