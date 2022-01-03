import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

import { Resolver } from '@bldr/media-resolver-ng'
import Player from '@bldr/player'

import App from '@/components/App.vue'
import ClassPlayableDemo from '@/components/classes-demo/PlayableDemo.vue'
import ClassPlayerDemo from '@/components/classes-demo/PlayerDemo.vue'
import ComponentMediaPlayerDemo from '@/components/components-demo/MediaPlayerDemo.vue'
import ComponentPlayButtonDemo from '@/components/components-demo/PlayButtonDemo.vue'
import ComponentProgressBarDemo from '@/components/components-demo/ProgressBarDemo.vue'
import ComponentWaveFormDemo from '@/components/components-demo/WaveFormDemo.vue'

Vue.config.productionTip = false

Vue.use(VueRouter)

const routes: RouteConfig[] = [
  {
    path: '/',
    component: ComponentPlayButtonDemo
  },
  {
    path: '/classes/playable',
    component: ClassPlayableDemo
  },
  {
    path: '/classes/player',
    component: ClassPlayerDemo
  },
  {
    path: '/components/media-player',
    component: ComponentMediaPlayerDemo
  },
  {
    path: '/components/play-button',
    component: ComponentPlayButtonDemo
  },
  {
    path: '/components/progress-bar',
    component: ComponentProgressBarDemo
  },
  {
    path: '/components/wave-form',
    component: ComponentWaveFormDemo
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export const resolver = new Resolver()

Vue.use(Player, resolver)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
