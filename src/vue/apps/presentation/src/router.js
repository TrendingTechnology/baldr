import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
// import { masterNames, masterOptions } from './masters.js'

// Components.
import CameraMaster from '@/masters/camera.vue'
import MasterDocumentation from '@/views/MasterDocumentation.vue'
import Documentation from '@/views/Documentation.vue'
import OpenNewPresentation from '@/views/OpenNewPresentation.vue'
import SlideRenderer from '@/views/SlideRenderer.vue'

// function masterExample (masterName) {
//   const masterRoute = {
//     path: masterName,
//     title: masterName,
//     component: MasterDocumentation
//   }
//   const options = masterOptions(masterName)
//   if ('examples' in options) {
//     const routes = []
//     for (const index in options.examples) {
//       const example = options.examples[index]
//       routes.push({
//         path: String(parseInt(index) + 1),
//         title: example.title,
//         component: SlideRenderer,
//         meta: {
//           master: masterName,
//           data: example.data
//         }
//       })
//     }
//     masterRoute.children = routes
//   }
//   return masterRoute
// }

// export function mastersExamples () {
//   const routes = []
//   for (const masterName of masterNames) {
//     const examples = masterExample(masterName)
//     if (examples) routes.push(examples)
//   }
//   return {
//     path: '/documentation',
//     title: 'Documentation',
//     component: Documentation,
//     children: routes
//   }
// }

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
  },
  {
    path: '/documentation/:master/examples/:no',
    name: 'master-example',
    component: SlideRenderer
  }
]

// const examples = mastersExamples()
// routes.push(examples)

export default new Router({
  routes
})
