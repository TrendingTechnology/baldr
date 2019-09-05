import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

// Components.
import CameraMaster from '@/masters/camera.vue'
import MasterDocumentation from '@/views/MasterDocumentation.vue'
import Documentation from '@/views/Documentation.vue'
import OpenNewPresentation from '@/views/OpenNewPresentation.vue'
import SlideRenderer from '@/views/SlideRenderer.vue'

Vue.use(Router)

const routes = [
  {
    path: '/',
    name: 'home',
    title: 'Home',
    component: Home
  },
  {
    path: '/open',
    title: 'Open a new presentation',
    component: OpenNewPresentation
  },
  {
    path: '/slides',
    title: 'slides',
    component: SlideRenderer
  },
  {
    path: '/document-camera',
    title: 'document-camera',
    component: CameraMaster
  },
  {
    path: '/documentation',
    title: 'Documentation',
    component: Documentation
  },
  {
    path: '/documentation/:master',
    name: 'documentation-master',
    title: 'Master Documentation',
    component: MasterDocumentation
  }
]

export default new Router({
  routes
})
