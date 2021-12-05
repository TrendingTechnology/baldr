import { Vue, VueRouter, RouteConfig } from '@bldr/vue-packages-bundler'

import { Resolver } from '@bldr/media-resolver-ng'

import App from '@/components/app/App.vue'
import Home from '@/components/app/Home.vue'
import PlayerDemo from '@/components/app/PlayerDemo.vue'
import PlayableDemo from '@/components/app/PlayableDemo.vue'
import VideoDemonstration from '@/components/app/VideoDemonstration.vue'
import PlayButtonDemo from '@/components/app/PlayButtonDemo.vue'

import { Player } from './main'

Vue.config.productionTip = false

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/player',
    component: PlayerDemo
  },
  {
    path: '/playable',
    component: PlayableDemo
  },
  {
    path: '/play-button',
    component: PlayButtonDemo
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

export const player = new Player(resolver)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')