import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

import icons from '@bldr/icons'
import { IconTypes } from '@bldr/type-definitions'

import App from './components/App.vue'
import AllStyles from './components/AllStyles.vue'
import AllIcons from './components/AllIcons.vue'
import Link from './components/Link.vue'
import VanishDemonstration from './components/VanishDemonstration.vue'

Vue.config.productionTip = false

Vue.use(VueRouter)
Vue.use(icons)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    component: AllIcons
  },
  {
    path: '/icons',
    component: AllIcons
  },
  {
    path: '/styles',
    component: AllStyles
  },
  {
    path: '/link',
    component: Link
  },
  {
    path: '/vanish',
    component: VanishDemonstration
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

function groupIcons () {
  const groupedIcons: Record<string, IconTypes.IconFontMapping> = {}

  for (const iconName in config.iconFont.iconMapping) {
    const icon = config.iconFont.iconMapping[iconName]

    const group = icon.group != null ? icon.group : 'other'
    if (groupedIcons[group] == null) {
      groupedIcons[group] = {}
    }

    groupedIcons[group][iconName] = icon
  }
  return groupedIcons
}

export const groupedIcons = groupIcons()

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
