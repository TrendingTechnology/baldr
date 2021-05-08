import ClientMediaAsset from './MediaAsset.vue'
import MediaOverview from './MediaOverview/index.vue'
import MediaCategories from './MediaCategories/index.vue'

const style = {
  darkMode: false
}
const routes = [
  {
    path: '/media',
    name: 'media-overview',
    meta: {
      shortcut: 'm',
      title: 'Media',
      style
    },
    component: MediaOverview
  },
  {
    path: '/media/:uriScheme/:uriAuthority',
    name: 'asset',
    meta: {
      title: 'Media file',
      style
    },
    component: ClientMediaAsset
  },
  {
    path: '/media-categories',
    name: 'media-categories',
    meta: {
      title: 'Meta-Daten Kategorien',
      style
    },
    component: MediaCategories
  }
]

export function addRoutes (router, shortcuts) {
  router.addRoutes(routes)
  shortcuts.fromRoute(routes[0])
}
