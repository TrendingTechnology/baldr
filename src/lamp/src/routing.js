/**
 * This module bundles all routing related code.
 *
 * - Set the document title by the current route.
 *
 * @module @bldr/lamp/routing
 */

import store from '@/store/index.js'

function setDocumentTitleByRoute (route) {
  console.log(route)
  const slide = store.getters['lamp/slide']
  const presentation = store.getters['lamp/presentation']

  if (slide && slide.title && (route.name === 'slide' || route.name === 'slide-step-no')) {
    document.title = `${presentation.title}: Folie Nr. ${slide.no} ${slide.title}`
  } else if (route.meta && route.meta.title) {
    document.title = route.meta.title
  } else {
    document.title = 'Lamp'
  }
}

export function installDocumentTitleUpdater (router) {
  router.afterEach((to, from) => {
    setDocumentTitleByRoute(to)
  })
}
