import Vue from 'vue'
import Router from 'vue-router'

import DynamicSelectView from '@/views/DynamicSelectView'
import HomeView from '@/views/HomeView'
import ModalView from '@/views/ModalView'
import TypographyView from '@/views/TypographyView'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/typography',
      name: 'typography',
      component: TypographyView
    },
    {
      path: '/modal',
      name: 'modal',
      component: ModalView
    },
    {
      path: '/dynamic-select',
      name: 'dynamic-select',
      component: DynamicSelectView
    }
  ]
})
