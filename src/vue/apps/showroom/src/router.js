import Vue from 'vue'
import Router from 'vue-router'

import ColorsView from '@/views/ColorsView'
import CssMarkupView from '@/views/CssMarkupView'
import DynamicSelectView from '@/views/DynamicSelectView'
import HomeView from '@/views/HomeView'
import MaterialIconView from '@/views/MaterialIconView'
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
    },
    {
      path: '/material-icon',
      name: 'material-icon',
      component: MaterialIconView
    },
    {
      path: '/css-markup',
      name: 'css-markup',
      component: CssMarkupView
    },
    {
      path: '/colors',
      name: 'colors',
      component: ColorsView
    }
  ]
})
