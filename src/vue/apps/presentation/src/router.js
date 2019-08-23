import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import OpenNewPresentation from './views/OpenNewPresentation.vue'
import CameraMaster from '@/masters/CameraMaster.vue'
import { masterNames, masterOptions } from './masters.js'
import SlideRenderer from '@/views/SlideRenderer.vue'

function makeRouteObject (masterName, { path, title, data }) {
  return {
    path: path,
    title: title,
    component: SlideRenderer,
    meta: {
      master: masterName,
      data
    }
  }
}

function masterExample (masterName) {
  const options = masterOptions(masterName)
  if ('examples' in options) {
    const routes = []
    for (const example of options.examples) {
      routes.push(makeRouteObject(masterName, example))
    }
    return {
      path: masterName,
      title: masterName,
      component: SlideRenderer,
      children: routes
    }
  }
}

export function mastersExamples () {
  const routes = []
  for (const masterName of masterNames) {
    const examples = masterExample(masterName)
    if (examples) routes.push(examples)
  }
  return {
    path: '/examples',
    title: 'examples',
    component: SlideRenderer,
    children: routes
  }
}

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
  }
]

const examples = mastersExamples()
routes.push(examples)

export default new Router({
  routes
})
