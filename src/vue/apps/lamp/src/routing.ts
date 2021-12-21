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
import { Route, VueRouter, NavigationGuardNext } from '@bldr/vue-packages-bundler'
import store from '@/store/index.js'
import { router } from '@/routes'

/* globals document gitHead compilationTime */

/**
 * Set the document title by the current route.
 *
 * @param {module:@bldr/lamp/routing/route} route
 */
function setDocumentTitleByRoute (route: Route) {
  const slide = store.getters['lamp/slide']
  const presentation = store.getters['lamp/presentation']

  const getBuildTimeTitle = function () {
    const buildTime = new Date(compilationTime).toLocaleString()
    let lastCommit = gitHead.short
    if (gitHead.isDirty) {
      lastCommit = `${lastCommit}-dirty`
    }
    return `Baldr Lamp (${buildTime} ${lastCommit})`
  }

  let title
  if (
    slide &&
    slide.title &&
    (route.name === 'slide' || route.name === 'slide-step-no')
  ) {
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
export function installDocumentTitleUpdater (router: VueRouter) {
  router.afterEach((to: Route, from: Route) => {
    setDocumentTitleByRoute(to)
  })
}

interface RouterView {
  slideNo: string
  stepNo: string
}

interface RouterViews {
  public: RouterView
  speaker: RouterView
}

/**
 * @type {Object}
 */
export const routerViews: RouterViews = {
  public: {
    slideNo: 'slide',
    stepNo: 'slide-step-no'
  },
  speaker: {
    slideNo: 'speaker-view',
    stepNo: 'speaker-view-step-no'
  }
}

interface RouterViewsCounterParts {
  [key: string]: string
}

/**
 *
 * @param {module:@bldr/lamp/routing.routerViews} routerViews
 */
function generateCounterParts (routerViews: RouterViews) {
  const counterParts: RouterViewsCounterParts = {}
  for (const viewName in routerViews) {
    if (viewName === 'public') {
      counterParts[routerViews[viewName].slideNo] = routerViews.speaker.slideNo
      counterParts[routerViews[viewName].stepNo] = routerViews.speaker.stepNo
    } else if (viewName === 'speaker') {
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
function isSpeakerRoute (route: Route): boolean {
  if (route.name != null) {
    return speakerRouteNames.includes(route.name)
  }
  return false
}

/**
 * If the route is `public` turn it into `speaker` and vice versa.
 *
 * @returns {Object} A deep copy of the route object.
 */
export function switchRouterView (route: Route): Route | undefined {
  if (route.name == null) return
  const newRoute: any = {}
  newRoute.name = counterParts[route.name]
  newRoute.params = Object.assign({}, route.params)
  newRoute.query = Object.assign({}, route.query)
  return newRoute as Route
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
async function loadPresentationById (vm: Vue, presRef: string) {
  console.log(presRef)
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
      await vm.$store.dispatch('lamp/openPresentation', {
        vm,
        rawYamlString: master.example
      })
      return
    }

    // common example
    const commonMatch = presRef.match(/^EP_common_(.*)$/)
    if (commonMatch) {
      const commonName = commonMatch[1]
      await vm.$store.dispatch('lamp/openPresentation', {
        vm,
        rawYamlString:
          vm.$store.getters['lamp/rawYamlExamples'].common[commonName]
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
async function loadPresentationByRoute (vm: Vue, route: Route) {
  try {
    if (route.params.presRef) {
      const presentation = vm.$store.getters['lamp/presentation']
      if (
        !presentation ||
        (presentation && presentation.ref !== route.params.presRef)
      ) {
        await loadPresentationById(vm, route.params.presRef)
      }
      if (route.params.slideNo) {
        if (route.params.stepNo)
          route.params.stepNo = parseInt(route.params.stepNo)
        vm.$store.dispatch('lamp/nav/setNavListNosByRoute', route)
      }
    }
  } catch (error) {
    vm.$showMessage.error(error)
  }
}

async function actOnRouteChange (vm: Vue, route: Route) {
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
  beforeRouteEnter (to: Route, from: Route, next: NavigationGuardNext) {
    next(vm => {
      actOnRouteChange(vm, to)
    })
  },
  // To be able to navigate throught the slide (only the params) are changing.
  beforeRouteUpdate (to: Route, from: Route, next: NavigationGuardNext) {
    actOnRouteChange(this, to)
    // To update the URL in the browser URL textbox.
    next()
  }
}
