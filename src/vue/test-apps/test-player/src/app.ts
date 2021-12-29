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
    path: '/class-playable-demo',
    component: ClassPlayableDemo
  },
  {
    path: '/class-player-demo',
    component: ClassPlayerDemo
  },
  {
    path: '/component-media-player-demo',
    component: ComponentMediaPlayerDemo
  },
  {
    path: '/component-play-button-demo',
    component: ComponentPlayButtonDemo
  },
  {
    path: '/component-progress-bar-demo',
    component: ComponentProgressBarDemo
  },
  {
    path: '/component-wave-form-demo',
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
