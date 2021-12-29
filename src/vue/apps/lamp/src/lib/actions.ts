/**
 * Wrap some actions into function to make them available for
 * the ipcRenderer of the Electron main process.
 */

import { Route } from 'vue-router'

import { styleConfigurator } from '@bldr/style-configurator'
import * as api from '@bldr/api-wrapper'
import { showMessage } from '@bldr/notification'
import { media } from '@bldr/media-client'

import store from '../store/index.js'
import { router } from './router-setup'
import vm from '../main'
import { loadPresentation } from './routing-related'

function logCatch (reason: unknown) {
  console.log(reason)
}

/**
 * Toggle between the destination and the last route:
 *
 * @param routeNameTo - The route name to move to or move
 *   from.
 */
function toggleLastRoute (routeNameTo: string): void {
  if (router.currentRoute.name === routeNameTo) {
    const lastRoute = store.getters['lamp/nav/lastRoute']
    if (lastRoute != null) {
      store.commit('lamp/nav/lastRoute', null)
      router.push(lastRoute).catch(logCatch)
    }
  } else {
    store.commit('lamp/nav/lastRoute', router.currentRoute)
    router.push({ name: routeNameTo }).catch(logCatch)
  }
}

/**
 * Call the REST API to open some files.
 *
 * @param openWith - open with `editor` specified in
 *  `config.mediaServer.editor` (`/etc/baldr.json`) or `folder` to open the
 *   parent folder of the given media file. The default value is `editor`.
 * @param archive - Open the file or the folder in the corresponding
 *   archive folder structure.
 * @param create - Create the possibly none existing directory
 *   structure in a recursive manner.
 */
function callOpenRestApi (
  openWith: string,
  archive = false,
  create = false
): void {
  const presentation = store.getters['lamp/presentation']
  if (presentation != null || Object.keys(presentation).length === 0) {
    showMessage.error(
      'Es ist keine Präsentation geladen.',
      'Der übergeordnete Ordner konnte nicht geöffnet werden.'
    )
    return
  }

  if (openWith === 'editor') {
    api
      .openEditor({
        ref: presentation.meta.ref,
        type: 'presentation'
      })
      .catch(logCatch)
  } else {
    api
      .openFileManager({
        ref: presentation.meta.ref,
        type: 'presentation',
        archive,
        create
      })
      .catch(logCatch)
  }
}

/**
 * Router paramters that indicate a specific slide with an step number
 * in a specific presentation.
 */
interface RouterParams {
  /**
   * The reference of the presentation, for example `Tradition_Futurismus`
   */
  presRef: string

  /**
   * The slide number starting from 1
   */
  slideNo?: number

  /**
   * The step number starting from 1
   */
  stepNo?: number

  [key: string]: any
}

function getNavRouteNameFromRoute (
  to: RouterParams,
  from: Route
): 'speaker-view-step-no' | 'speaker-view' | 'slide-step-no' | 'slide' {
  if (from.name === 'speaker-view' || from.name === 'speaker-view-step-no') {
    if (to.stepNo != null) {
      return 'speaker-view-step-no'
    } else {
      return 'speaker-view'
    }
  } else {
    if (to.stepNo != null) {
      return 'slide-step-no'
    } else {
      return 'slide'
    }
  }
}

/**
 * Navigate through the slides (skiping the steps) by updating the route.
 *
 * @param direction - `1`: next, `-1`: previous
 */
function goToNextSlideByDirection (direction: 1 | -1): void {
  const presentation = store.getters['lamp/presentation']
  if (presentation == null) {
    return
  }
  const slide = store.getters['lamp/slide']
  const slides = store.getters['lamp/slides']
  const slidesCount = store.getters['lamp/slidesCount']

  const params: RouterParams = { presRef: presentation.ref }

  // next
  if (direction === 1 && slide.no === slidesCount) {
    params.slideNo = 1
    // previous
  } else if (direction === -1 && slide.no === 1) {
    params.slideNo = slidesCount
  } else {
    params.slideNo = (slide.no as number) + direction
  }

  // next
  if (direction === 1) {
    store.dispatch('lamp/highlightCursorArrow', 'right').catch(logCatch)
    // previous
  } else if (direction === -1) {
    store.dispatch('lamp/highlightCursorArrow', 'left').catch(logCatch)
  }

  if (params.slideNo != null) {
    const slideNext = slides[params.slideNo - 1]

    if (slideNext.stepCount > 1) {
      params.stepNo = 1
    }
  }

  const name = getNavRouteNameFromRoute(params, router.currentRoute)

  router.push({ name, params }).catch(logCatch)
}

/**
 * Navigate through the steps of a slide by updating the route.
 *
 * @param direction - `1`: next, `-1`: previous
 */
function goToNextStepByDirection (direction: 1 | -1): void {
  const presentation = store.getters['lamp/presentation']
  if (presentation == null) {
    return
  }
  const slide = store.getters['lamp/slide']

  if (slide.stepCount == null || slide.stepCount < 2) {
    return
  }

  const params: RouterParams | string = {
    presRef: presentation.ref,
    slideNo: slide.no as number
  }

  // next
  if (direction === 1 && slide.stepNo === slide.stepCount) {
    params.stepNo = 1
    // previous
  } else if (direction === -1 && slide.stepNo === 1) {
    params.stepNo = slide.stepCount
  } else {
    params.stepNo = (slide.stepNo as number) + direction
  }

  // next
  if (direction === 1) {
    store.dispatch('lamp/highlightCursorArrow', 'down').catch(logCatch)
    // previous
  } else if (direction === -1) {
    store.dispatch('lamp/highlightCursorArrow', 'up').catch(logCatch)
  }

  router.push({ name: 'slide-step-no', params }).catch(logCatch)
}

/**
 * Navigate through the presentation by updating the route.
 *
 * @param direction - `1`: next, `-1`: previous
 */
function goToNextSlideOrStepByDirection (direction: 1 | -1): void {
  const presentation = store.getters['lamp/presentation']
  if (presentation == null) {
    return
  }
  const params = store.getters['lamp/nav/nextRouterParams'](direction)
  params.presRef = presentation.ref

  const name = getNavRouteNameFromRoute(params, router.currentRoute)

  // next
  if (direction === 1) {
    if (params.stepNo != null && params.stepNo !== 1) {
      store.dispatch('lamp/highlightCursorArrow', 'down').catch(logCatch)
    } else {
      store.dispatch('lamp/highlightCursorArrow', 'right').catch(logCatch)
    }
    // previous
  } else if (direction === -1) {
    if (
      params.stepNo != null &&
      params.stepNo !== store.getters['lamp/slide'].stepCount
    ) {
      store.dispatch('lamp/highlightCursorArrow', 'up').catch(logCatch)
    } else {
      store.dispatch('lamp/highlightCursorArrow', 'left').catch(logCatch)
    }
  }

  router.push({ name, params }).catch(logCatch)
}

export function resetSlideScaleFactor (): void {
  store.dispatch('lamp/resetSlideScaleFactor').catch(logCatch)
}

export function increaseSlideScaleFactor (): void {
  store.dispatch('lamp/increaseSlideScaleFactor').catch(logCatch)
}

export function decreaseSlideScaleFactor (): void {
  store.dispatch('lamp/decreaseSlideScaleFactor').catch(logCatch)
}

export function toggleSlides (): void {
  store.dispatch('lamp/setSlideNoToOld').catch(logCatch)
}

export async function update (): Promise<void> {
  try {
    const result = await api.updateMediaServer()
    store.dispatch('lamp/titles/loadRootTreeList').catch(logCatch)
    if (result.errors.length > 0) {
      for (const errorMsg of result.errors) {
        showMessage.error(errorMsg)
      }
    } else {
      showMessage.success(
        `Der lokale Medien-Server wurde erfolgreich aktualisiert. Git-Commit-ID: ${result.lastCommitId.substring(
          0,
          8
        )}`
      )
    }
  } catch (error) {
    showMessage.error(error as Error)
  }
}

export function openEditor (): void {
  callOpenRestApi('editor')
}

export function openMedia (): void {
  const slide = store.getters['lamp/slide']
  if (slide?.firstMediaUri != null) {
    const uri = slide.firstMediaUri.split(':')[1]
    api.openEditor({ ref: uri, type: 'asset' }).catch(logCatch)
  } else {
    showMessage.error('Die aktuelle Folie hat keine Mediendatei zum Öffnen.')
  }
}

export function openParent (): void {
  callOpenRestApi('folder')
}

export function openParentArchive (): void {
  callOpenRestApi('folder', true)
}

export function openEditorParentArchive (): void {
  callOpenRestApi('editor')
  callOpenRestApi('folder', true, true)
}

export async function reloadPresentation (): Promise<void> {
  const presentation = store.getters['lamp/presentation']
  if (presentation == null) {
    showMessage.error('Keine Präsention geladen.')
    return
  }
  try {
    await loadPresentation(vm, presentation.ref, true)
    showMessage.success('Die Präsentation wurde neu geladen.')
  } catch (error) {
    showMessage.error(error as Error)
  }
}

export function toggleMetaDataOverlay (): void {
  store.dispatch('lamp/toggleMetaDataOverlay').catch(logCatch)
}

/**
 * Toggle the speaker view.
 */
export function toggleSpeakerView (): void {
  const route = router.currentRoute
  let name
  const params = route.params
  if (route.name === 'slide') {
    name = 'speaker-view'
  } else if (route.name === 'slide-step-no') {
    name = 'speaker-view-step-no'
  } else if (route.name === 'slides-preview') {
    name = 'speaker-view'
    if (params.slideNo == null) {
      params.slideNo = '1'
      delete params.stepNo
    }
  } else if (route.name === 'speaker-view') {
    name = 'slide'
  } else if (route.name === 'speaker-view-step-no') {
    name = 'slide-step-no'
  }
  if (name != null) {
    router.push({ name, params: route.params }).catch(logCatch)
  }
}

export function toggleMediaOverview (): void {
  toggleLastRoute('media-overview')
}

export function toggleHome (): void {
  toggleLastRoute('home')
}

export function toggleSlidesPreview (): void {
  toggleLastRoute('slides-preview')
}

export function toggleRestApi (): void {
  toggleLastRoute('rest-api')
}

export function toggleCamera (): void {
  toggleLastRoute('camera')
}

export function toggleEditor (): void {
  toggleLastRoute('editor')
}

export function goToPreviousSlide (): void {
  goToNextSlideByDirection(-1)
}

export function goToNextSlide (): void {
  goToNextSlideByDirection(1)
}

export function goToPreviousStep (): void {
  goToNextStepByDirection(-1)
}

export function goToNextStep (): void {
  goToNextStepByDirection(1)
}

export function goToPreviousSlideOrStep (): void {
  goToNextSlideOrStepByDirection(-1)
}

export function goToNextSlideOrStep (): void {
  goToNextSlideOrStepByDirection(1)
}

export function toggleDarkMode (): void {
  styleConfigurator.toggleDarkMode()
}

export function resetStyles (): void {
  styleConfigurator.reset()
}

export function enterFullscreen (): void {
  styleConfigurator.toggleFullscreen()
}

export function togglePlayer (): void {
  media.player.toggle()
}
export function startPlayer (): void {
  media.player.start()
}

export function stopPlayer (): void {
  media.player.stop()
}

export function fadeOutPlayer (): void {
  media.player.stop(4)
}

export function startPreviousInPlaylist (): void {
  media.playList.startPrevious()
}

export function startNextInPlaylist (): void {
  media.playList.startNext()
}

export function forwardPlayer (): void {
  media.player.forward()
}
export function backwardPlayer (): void {
  media.player.backward()
}
