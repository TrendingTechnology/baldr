import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

// Components.
import CameraMaster from '@/masters/camera.vue'
import Documentation from '@/views/Documentation.vue'
import MasterDocumentation from '@/views/MasterDocumentation.vue'
import MediaOverview from '@/views/MediaOverview.vue'
import OpenFiles from '@/views/OpenFiles.vue'
import SlideView from '@/views/SlideView'
import ShortcutsOverview from '@/views/ShortcutsOverview.vue'
import RestApiOverview from '@/views/RestApiOverview.vue'

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
    title: 'Open',
    component: OpenFiles
  },
  {
    path: '/slides',
    title: 'slides',
    component: SlideView
  },
  {
    path: '/media',
    title: 'Media',
    component: MediaOverview
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
  },
  {
    path: '/shortcuts',
    name: 'shortcuts',
    title: 'Shortcuts',
    component: ShortcutsOverview
  },
  {
    path: '/rest-api',
    name: 'rest-api',
    title: 'REST-API',
    component: RestApiOverview
  }
]

export default new Router({
  routes
})
