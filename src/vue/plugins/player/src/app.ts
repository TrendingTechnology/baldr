import { Vue, VueRouter, RouteConfig } from '@bldr/vue-packages-bundler'

import { Resolver } from '@bldr/media-resolver-ng'

import App from '@/components/app/App.vue'
import ClassPlayableDemo from '@/components/app/ClassPlayableDemo.vue'
import ClassPlayerDemo from '@/components/app/ClassPlayerDemo.vue'
import ComponentMediaPlayerDemo from '@/components/app/ComponentMediaPlayerDemo.vue'
import ComponentPlayButtonDemo from '@/components/app/ComponentPlayButtonDemo.vue'
import ComponentProgressBarDemo from '@/components/app/ComponentProgressBarDemo.vue'
import ComponentWaveFormDemo from '@/components/app/ComponentWaveFormDemo.vue'

import Plugin from './plugin'

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

Vue.use(Plugin, resolver)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
