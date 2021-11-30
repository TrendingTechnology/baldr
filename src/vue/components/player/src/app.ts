import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

import { Resolver } from '@bldr/media-resolver-ng'

import App from '@/components/app/App.vue'
import Home from '@/components/app/Home.vue'
import AudioDemonstration from '@/components/app/AudioDemonstration.vue'
import VideoDemonstration from '@/components/app/VideoDemonstration.vue'

import { PlayerCache } from './main'

Vue.config.productionTip = false

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/audio',
    component: AudioDemonstration
  },
  {
    path: '/Video',
    component: VideoDemonstration
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export const resolver = new Resolver()

export const playerCache = new PlayerCache(resolver)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
