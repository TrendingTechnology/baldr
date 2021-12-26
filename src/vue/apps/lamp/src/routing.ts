/**
 * This module bundles all routing related code.
 *
 * - Set the document title by the current route.
 * - Provide router guards for some components.
 *
 * @module @bldr/lamp/routing
 */

import VueRouter, { Route, NavigationGuardNext } from 'vue-router'

import { shortenText } from '@bldr/string-format'
import { showMessage } from '@bldr/notification'
import { media } from '@bldr/media-client'
import * as api from '@bldr/api-wrapper'

import { parse as parsePresentation } from '@bldr/presentation-parser'

import store from '@/store/index.js'
import { router } from '@/routes'

import Vm from './main'

/**
 * Set the document title by the current route.
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

export function installDocumentTitleUpdater (router: VueRouter): void {
  router.afterEach((to: Route) => {
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

const speakerRouteNames = Object.values(routerViews.speaker)

const counterParts = generateCounterParts(routerViews)

function isSpeakerRoute (route: Route): boolean {
  if (route.name != null) {
    return speakerRouteNames.includes(route.name)
  }
  return false
}

/**
 * If the route is `public` turn it into `speaker` and vice versa.
 *
 * @returns A deep copy of the route object.
 */
export function switchRouterView (route: Route): Route | undefined {
  if (route.name == null) return
  const newRoute: any = {}
  newRoute.name = counterParts[route.name]
  newRoute.params = Object.assign({}, route.params)
  newRoute.query = Object.assign({}, route.query)
  return newRoute as Route
}

export function getViewFromRoute (): 'speaker' | 'public' {
  const name = router.currentRoute.name
  if (name === 'speaker-view' || name === 'speaker-view-step-no') {
    return 'speaker'
  }
  return 'public'
}

async function loadPresentationByRef (vm: typeof Vm, presRef: string) {
  console.log(presRef)
  media.player.stop()
  vm.$store.dispatch('media/clear')
  vm.$store.commit('lamp/setPresentation', null)

  // Get the yaml content as a string of a presentation for quick refresh
  let rawYamlString: string | null = null

  // master example
  const masterMatch = presRef.match(/^EP_master_(.*)$/)
  if (masterMatch != null) {
    rawYamlString = rawYamlExamples.masters[masterMatch[1]]
  }

  // common example
  const commonMatch = presRef.match(/^EP_common_(.*)$/)
  if (commonMatch != null) {
    rawYamlString = rawYamlExamples.common[commonMatch[1]]
  }

  if (rawYamlString == null) {
    const dbPresentation = await api.getPresentationByRef(presRef)
    rawYamlString = await api.readMediaAsString(dbPresentation.meta.path)
  }

  const presentationNg = parsePresentation(rawYamlString)
  console.log(presentationNg)

  await vm.$store.dispatch('lamp/openPresentation', { vm, rawYamlString })
}

/**
 * Load presentation and set navigation list numbers.
 */
async function loadPresentationByRoute (vm: typeof Vm, route: Route) {
  try {
    if (route.params.presRef != null) {
      const presentation = vm.$store.getters['lamp/presentation']
      if (
        presentation == null ||
        (presentation != null && presentation.ref !== route.params.presRef)
      ) {
        await loadPresentationByRef(vm, route.params.presRef)
      }
      if (route.params.slideNo != null) {
        vm.$store.dispatch('lamp/nav/setNavListNosByRoute', route)
      }
    }
  } catch (error) {
    showMessage.error(error as Error)
  }
}

async function actOnRouteChange (vm: any, route: Route) {
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
  beforeRouteEnter (to: Route, from: Route, next: NavigationGuardNext): void {
    next(vm => {
      actOnRouteChange(vm, to)
    })
  },
  // To be able to navigate throught the slide (only the params) are changing.
  beforeRouteUpdate (to: Route, from: Route, next: NavigationGuardNext): void {
    actOnRouteChange(this, to)
    // To update the URL in the browser URL textbox.
    next()
  }
}
