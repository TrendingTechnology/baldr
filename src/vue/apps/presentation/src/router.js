import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Overview from './views/Overview.vue'
import DocumentCamera from './views/DocumentCamera.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/overview',
      name: 'overview',
      component: Overview
    },
    {
      path: '/document-camera',
      name: 'document-camera',
      component: DocumentCamera
    }
  ]
})
