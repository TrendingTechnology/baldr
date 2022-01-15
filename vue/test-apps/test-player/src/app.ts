import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

import { Resolver } from '@bldr/media-resolver'
import Player from '@bldr/player'

import App from '@/components/App.vue'
import ClassPlayableDemo from '@/components/classes-demo/PlayableDemo.vue'
import ClassPlayerDemo from '@/components/classes-demo/PlayerDemo.vue'
import ComponentHorizontalPlayButtonsDemo from '@/components/components-demo/HorizontalPlayButtonsDemo.vue'
import ComponentMediaPlayerDemo from '@/components/components-demo/MediaPlayerDemo.vue'
import ComponentPlayableBaseDemo from '@/components/components-demo/PlayableBaseDemo.vue'
import ComponentPlayableTextDemo from '@/components/components-demo/PlayableTextDemo.vue'
import ComponentPlayButtonDemo from '@/components/components-demo/PlayButtonDemo.vue'
import ComponentProgressBarDemo from '@/components/components-demo/ProgressBarDemo.vue'
import ComponentVideoScreenDemo from '@/components/components-demo/VideoScreenDemo.vue'
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
    path: '/components/horizontal-play-buttons',
    component: ComponentHorizontalPlayButtonsDemo
  },
  {
    path: '/components/playable-base',
    component: ComponentPlayableBaseDemo
  },
  {
    path: '/components/playable-text',
    component: ComponentPlayableTextDemo
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
    path: '/components/video-screen',
    component: ComponentVideoScreenDemo
  },
  {
    path: '/components/wave-form',
    component: ComponentWaveFormDemo
  }
]

export interface TestAsset {
  uuid: string
  ref?: string
  title?: string
  samples?: Record<string, string>
  mimeType?: string
}

export interface TestDataCollection {
  [shortName: string]: TestAsset
}

export const data: TestDataCollection = {
  aicha: {
    title: 'Aïcha',
    uuid: 'uuid:e24e04ed-3aed-45d3-9280-a122658b6a0a',
    mimeType: 'audio'
  },
  cheikha: {
    title: 'Cheikha Rimitti: Charrag, gattaa',
    uuid: 'uuid:6defb53b-d43d-4353-ab7e-f8c7bcfb114e',
    mimeType: 'audio'
  },
  egmont: {
    title: 'Beethoven: Egmont-Ouvertüre',
    ref: 'ref:Egmont_HB_Egmont-Ouverture',
    uuid: 'uuid:70028b77-b817-46e2-b6fa-fe3c6383d748',
    mimeType: 'audio',
    samples: {
      spanier: '#Thema_Spanier',
      niederlaender: '#Thema_Niederlaender'
    }
  },
  entstehung: {
    title: 'Jazz: Entstehung aus soziologischer Sicht',
    ref: 'ref:Entstehung_VD_Entstehung-aus-soziologischer-Sicht',
    uuid: 'uuid:49ba792d-1a19-48d5-9cfe-50833fa6e8b9',
    mimeType: 'video'
  },
  gebadet: {
    title: 'Du bist als Kind zu heiß gebadet worden',
    ref: 'ref:Du-bist-als-Kind-zu-heiss-gebadet-worden',
    uuid: 'uuid:4f6c6b03-e5d1-4fc8-8bb9-ab3ffea8fb64',
    mimeType: 'audio'
  },
  grammophon: {
    title: 'Ich hab’ zu Haus ein Grammophon',
    ref: 'ref:Ich-hab-zu-Haus-ein-Grammophon',
    uuid: 'uuid:3e7d9633-6713-4f21-8c3d-f75ccc4ed38a',
    mimeType: 'audio'
  },
  intonarumori: {
    title: 'Intonarumori',
    ref: 'ref:Futurismus_VD_Intonarumori',
    uuid: 'uuid:b5b15b74-3b40-4da1-9e56-8962fb9b214b',
    mimeType: 'video'
  },
  kaktus: {
    title: 'Mein kleiner grüner Kaktus',
    ref: 'ref:Mein-kleiner-gruener-Kaktus',
    uuid: 'uuid:127abf7e-8b86-4bc3-8064-88efbc4c7f9e',
    mimeType: 'audio'
  },
  mannenberg: {
    title: 'Mannenberg',
    uuid: 'uuid:e402afc0-930d-4c95-b93d-1e906261300e',
    mimeType: 'audio'
  },
  oops: {
    title: 'Oops! … I Did It Again',
    ref: 'ref:YT_CduA0TULnow',
    uuid: 'uuid:0ae7f334-c6e4-46cb-8bf1-cf0d30f52cf3',
    mimeType: 'video'
  },
  tor: {
    title: 'Das große Tor von Kiew',
    ref: 'ref:Grosses-Tor_HB_Orchester_Samples',
    uuid: 'uuid:702ba259-349a-459f-bc58-cf1b0da37263',
    mimeType: 'audio',
    samples: {
      tor: '#tor',
      kapelle: '#kapelle',
      glocken: '#glocken',
      menschen: '#menschen'
    }
  }
}

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
