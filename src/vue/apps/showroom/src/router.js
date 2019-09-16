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
      shortcut: 'h',
      component: HomeView
    },
    {
      path: '/typography',
      name: 'typography',
      shortcut: 't',
      component: TypographyView
    },
    {
      path: '/modal',
      name: 'modal',
      shortcut: 'm',
      component: ModalView
    },
    {
      path: '/dynamic-select',
      name: 'dynamic-select',
      shortcut: 'd',
      component: DynamicSelectView
    },
    {
      path: '/material-icon',
      name: 'material-icon',
      shortcut: 'i',
      component: MaterialIconView
    },
    {
      path: '/css-markup',
      name: 'css-markup',
      shortcut: 'c',
      component: CssMarkupView
    },
    {
      path: '/colors',
      name: 'colors',
      shortcut: 'f',
      component: ColorsView
    }
  ]
})
