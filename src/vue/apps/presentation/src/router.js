import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Overview from './views/Overview.vue'
import DocumentCamera from './views/DocumentCamera.vue'
import { mastersExamples } from './masters.js'

Vue.use(Router)

const routes = [
  {
    path: '/',
    name: 'home',
    title: 'Home',
    component: Home
  },
  {
    path: '/overview',
    title: 'overview',
    component: Overview
  },
  {
    path: '/document-camera',
    title: 'document-camera',
    component: DocumentCamera
  }
]

const examples = mastersExamples()
routes.push(examples)

export default new Router({
  routes
})
