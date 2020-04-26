/**
 * This module bundles all routing related code.
 *
 * - Set the document title by the current route.
 *
 * @module @bldr/lamp/routing
 */

/**
 * The route object of the Vue Router package.
 *
 * @see {@link https://router.vuejs.org/api/#the-route-object Vue Router Api documentation}
 *
 * @typedef route
 */

/**
 * An instance of the Vue Router.
 *
 * @see {@link https://router.vuejs.org/api/#router-construction-options Vue Router Api documentation}
 *
 * @typedef router
 */

/**
 * Routes can be divided into two categories: A public route (visible for
 * the audience) and speaker router (visible only for the speaker). Possible
 * values: `public` or `speaker`.
 *
 * @typedef {string} view
 */

import store from '@/store/index.js'

/* globals document */

/**
 * @param {module:@bldr/lamp/routing/route} route
 */
function setDocumentTitleByRoute (route) {
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

/**
 * @param {module:@bldr/lamp/routing/route} router
 */
export function installDocumentTitleUpdater (router) {
  router.afterEach((to, from) => {
    setDocumentTitleByRoute(to)
  })
}
