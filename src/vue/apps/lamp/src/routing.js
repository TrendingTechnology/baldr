/**
 * This module bundles all routing related code.
 *
 * - Set the document title by the current route.
 * - Provide router guards for some components.
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
 * A Vue instance. A Vue instance is essentially a ViewModel as defined in the
 * MVVM pattern, hence the variable name `vm` you will see throughout the docs.
 *
 * @see {@link https://v1.vuejs.org/guide/instance.html}
 *
 * @typedef vm
 */

/**
 * Routes can be divided into two categories: A public route (visible for
 * the audience) and speaker router (visible only for the speaker). Possible
 * values: `public` or `speaker`.
 *
 * @typedef {string} view
 */

import { masterCollection } from '@bldr/lamp-core'
import { shortenText } from '@bldr/string-format'

import store from '@/store/index.js'
import { router } from '@/routes'

/* globals document gitHead compilationTime */

/**
 * Set the document title by the current route.
 *
 * @param {module:@bldr/lamp/routing/route} route
 */
function setDocumentTitleByRoute (route) {
  const slide = store.getters['lamp/slide']
  const presentation = store.getters['lamp/presentation']

  const getBuildTimeTitle = function () {
    const buildTime = new Date(compilationTime).toLocaleString()
    let lastCommit = gitHead.short
    if (gitHead.dirty) {
      lastCommit = `${lastCommit}-dirty`
    }
    return `Baldr Lamp (${buildTime} ${lastCommit})`
  }

  let title
  if (slide && slide.title && (route.name === 'slide' || route.name === 'slide-step-no')) {
    title = `Nr. ${slide.no} [${slide.master.title}]: ${slide.title} (${presentation.title})`
  } else if (route.name === 'home') {
    title = getBuildTimeTitle()
  } else if (route.meta && route.meta.title) {
    title = route.meta.title
  } else {
    title = getBuildTimeTitle()
  }

  document.title = shortenText(title, { stripTags: true, maxLength: 125 })
}

/**
 * @param {module:@bldr/lamp/routing~route} router
 */
export function installDocumentTitleUpdater (router) {
  router.afterEach((to, from) => {
    setDocumentTitleByRoute(to)
  })
}

/**
 * @type {Object}
 */
export const routerViews = {
  public: {
    slideNo: 'slide',
    stepNo: 'slide-step-no'
  },
  speaker: {
    slideNo: 'speaker-view',
    stepNo: 'speaker-view-step-no'
  }
}

/**
 *
 * @param {module:@bldr/lamp/routing.routerViews} routerViews
 */
function generateCounterParts (routerViews) {
  const counterParts = {}
  for (const viewName in routerViews) {
    if (viewName === 'public') {
      counterParts[routerViews[viewName].slideNo] = routerViews.speaker.slideNo
      counterParts[routerViews[viewName].stepNo] = routerViews.speaker.stepNo
    } else {
      counterParts[routerViews[viewName].slideNo] = routerViews.public.slideNo
      counterParts[routerViews[viewName].stepNo] = routerViews.public.stepNo
    }
  }
  return counterParts
}

// const publicRouteNames = Object.values(routerViews.public)
const speakerRouteNames = Object.values(routerViews.speaker)

const counterParts = generateCounterParts(routerViews)

/**
 * @param {module:@bldr/lamp/routing~route} route
 */
function isSpeakerRoute (route) {
  return speakerRouteNames.includes(route.name)
}

/**
 * If the route is `public` turn it into `speaker` and vice versa.
 *
 * @param {module:@bldr/lamp/routing~route} route
 *
 * @returns {Object} A deep copy of the route object.
 */
export function switchRouterView (route) {
  const newRoute = {}
  newRoute.name = counterParts[route.name]
  newRoute.params = Object.assign({}, route.params)
  newRoute.query = Object.assign({}, route.query)
  return newRoute
}

/**
 * @returns {module:@bldr/lamp/routing~view}
 */
export function getViewFromRoute () {
  const name = router.currentRoute.name
  if (name === 'speaker-view' || name === 'speaker-view-step-no') {
    return 'speaker'
  }
  return 'public'
}

/**
 * @param {module:@bldr/lamp/routing~vm} vm
 * @param {String} presRef - Presentation ID.
 */
async function loadPresentationById (vm, presRef) {
  vm.$media.player.stop()
  vm.$store.dispatch('media/clear')
  vm.$store.commit('lamp/setPresentation', null)

  // EP: Example
  if (presRef.match(/^EP_.*$/)) {
    // master example
    const masterMatch = presRef.match(/^EP_master_(.*)$/)
    if (masterMatch) {
      const masterName = masterMatch[1]
      const master = masterCollection.get(masterName)
      await vm.$store.dispatch('lamp/openPresentation', { vm, rawYamlString: master.example })
      return
    }

    // common example
    const commonMatch = presRef.match(/^EP_common_(.*)$/)
    if (commonMatch) {
      const commonName = commonMatch[1]
      await vm.$store.dispatch('lamp/openPresentation', {
        vm,
        rawYamlString: vm.$store.getters['lamp/rawYamlExamples'].common[commonName]
      })
      return
    }
  }

  await vm.$store.dispatch('lamp/openPresentationById', { vm, presRef })
}

/**
 * Load presentation and set navigation list numbers.
 *
 * @param {module:@bldr/lamp/routing~vm} vm
 * @param {module:@bldr/lamp/routing~route} route
 */
async function loadPresentationByRoute (vm, route) {
  try {
    if (route.params.presRef) {
      const presentation = vm.$store.getters['lamp/presentation']
      if (!presentation || (presentation && presentation.ref !== route.params.presRef)) {
        await loadPresentationById(vm, route.params.presRef)
      }
      if (route.params.slideNo) {
        if (route.params.stepNo) route.params.stepNo = parseInt(route.params.stepNo)
        vm.$store.dispatch('lamp/nav/setNavListNosByRoute', route)
      }
    }
  } catch (error) {
    vm.$showMessage.error(error)
  }
}

/**
 * @param {module:@bldr/lamp/routing~vm} vm
 * @param {module:@bldr/lamp/routing~route} route
 */
async function actOnRouteChange (vm, route) {
  await loadPresentationByRoute(vm, route)
  if (isSpeakerRoute(route)) {
    const publicRoute = switchRouterView(route)
    vm.$socket.sendObj({ route: publicRoute })
  }
}

/**
 * Router guards for some components which can be accessed by router links.
 * This components use the router guards:
 *
 * - `SlidePreview`
 * - `SlideView`
 * - `SpeakerView`
 */
export const routerGuards = {
  // To be able to enter a presentation per HTTP link on a certain slide.
  // Without this hook there are webpack errors.
  beforeRouteEnter (to, from, next) {
    next(vm => {
      actOnRouteChange(vm, to)
    })
  },
  // To be able to navigate throught the slide (only the params) are changing.
  beforeRouteUpdate (to, from, next) {
    actOnRouteChange(this, to)
    // To update the URL in the browser URL textbox.
    next()
  }
}
