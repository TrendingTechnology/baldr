import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

// Components.
import OpenInterface from '@/components/OpenInterface'
import RestApiOverview from '@/views/RestApiOverview.vue'

import Documentation from '@/views/Documentation.vue'
import MasterDocumentation from '@/views/MasterDocumentation.vue'

import SlideView from '@/views/SlideView'
import MasterRenderer from '@/views/SlideView/MasterRenderer.vue'
import SlidesOverview from '@/views/SlidesOverview'

// Failed to load chunks in the subfolder presentation
// const Documentation = () => import(/* webpackChunkName: "documentation" */ '@/views/Documentation.vue')
// const MasterDocumentation = () => import(/* webpackChunkName: "documentation" */ '@/views/MasterDocumentation.vue')

// const SlideView = () => import(/* webpackChunkName: "slides" */ '@/views/SlideView')
// const MasterRenderer = () => import(/* webpackChunkName: "slides" */ '@/views/SlideView/MasterRenderer.vue')

Vue.use(Router)

const routes = [
  {
    path: '/',
    name: 'home',
    title: 'Home',
    shortcut: 'h',
    component: Home
  },
  {
    path: '/open',
    title: 'Open',
    component: OpenInterface
  },
  {
    path: '/slides',
    shortcut: 's',
    title: 'slides',
    component: SlideView
  },
  {
    path: '/slides-overview',
    shortcut: 'o',
    title: 'slides-overview',
    component: SlidesOverview
  },
  {
    path: '/camera',
    title: 'camera',
    shortcut: 'c',
    component: MasterRenderer,
    meta: {
      master: 'camera'
    }
  },
  {
    path: '/editor',
    title: 'editor',
    shortcut: 'e',
    component: MasterRenderer,
    meta: {
      master: 'editor',
    }
  },
  {
    path: '/documentation',
    title: 'Documentation',
    shortcut: 'd',
    component: Documentation
  },
  {
    path: '/documentation/:master',
    name: 'documentation-master',
    title: 'Master Documentation',
    component: MasterDocumentation
  },
  {
    path: '/rest-api',
    name: 'rest-api',
    shortcut: 'r',
    title: 'REST-API',
    component: RestApiOverview
  }
]

export default new Router({
  routes
})
