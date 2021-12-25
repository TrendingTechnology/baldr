/**
 * Wrap some actions into function to make them available for
 * the ipcRenderer of the Electron main process.
 *
 * @module @bldr/lamp/actions
 */

import { styleConfigurator } from '@bldr/style-configurator'
import * as api from '@bldr/api-wrapper'
import { showMessage } from '@bldr/notification'

import store from './store/index.js'
import vm from './main'
import { router } from './routes'

/**
 * Toggle between the destination and the last route:
 *
 * @param {String} routeNameTo - The route name to move to or move
 *   from.
 */
function toggleLastRoute (routeNameTo) {
  if (router.currentRoute.name === routeNameTo) {
    const lastRoute = store.getters['lamp/nav/lastRoute']
    if (lastRoute) {
      store.commit('lamp/nav/lastRoute', null)
      router.push(lastRoute)
    }
  } else {
    store.commit('lamp/nav/lastRoute', router.currentRoute)
    router.push({ name: routeNameTo })
  }
}

/**
 * Call the REST API to open some files.
 *
 * @param {String} openWith - open with `editor` specified in
 *  `config.mediaServer.editor` (`/etc/baldr.json`) or `folder` to open the
 *   parent folder of the given media file. The default value is `editor`.
 * @param {Boolean} archive - Open the file or the folder in the corresponding
 *   archive folder structure.
 * @param {Boolean} create - Create the possibly none existing directory
 *   structure in a recursive manner.
 */
function callOpenRestApi (openWith, archive = false, create = false) {
  const presentation = store.getters['lamp/presentation']
  if (!presentation || Object.keys(presentation).length === 0) {
    vm.$showMessage.error(
      'Es ist keine Präsentation geladen.',
      'Der übergeordnete Ordner konnte nicht geöffnet werden.'
    )
    return
  }

  if (openWith === 'editor') {
    api.openEditor({
      ref: presentation.meta.ref,
      type: 'presentation'
    })
  } else {
    api.openFileManager({
      ref: presentation.meta.ref,
      type: 'presentation',
      archive,
      create
    })
  }
}

/**
 * Router paramters that indicate a specific slide with an step number
 * in a specific presentation.
 *
 * @typedef {Object} routerParams
 * @property {String} presRef - The ID of the presentation, for example
 *   `Tradition_Futurismus`
 * @property {Number} slideNo - The slide number starting from 1.
 * @property {Number} stepNo  - The step number starting from 1.
 */

/**
 *
 * @param {Object} to
 * @param {Object} from
 */
function getNavRouteNameFromRoute (to, from) {
  if (from.name === 'speaker-view' || from.name === 'speaker-view-step-no') {
    if (to.stepNo) {
      return 'speaker-view-step-no'
    } else {
      return 'speaker-view'
    }
  } else {
    if (to.stepNo) {
      return 'slide-step-no'
    } else {
      return 'slide'
    }
  }
}

/**
 * Navigate through the slides (skiping the steps) by updating the route.
 *
 * @param {Number} direction - `1`: next, `-1`: previous
 */
function goToNextSlide (direction) {
  const presentation = store.getters['lamp/presentation']
  if (!presentation) return
  const slide = store.getters['lamp/slide']
  const slides = store.getters['lamp/slides']
  const slidesCount = store.getters['lamp/slidesCount']

  const params = { presRef: presentation.ref }

  // next
  if (direction === 1 && slide.no === slidesCount) {
    params.slideNo = 1
    // previous
  } else if (direction === -1 && slide.no === 1) {
    params.slideNo = slidesCount
  } else {
    params.slideNo = slide.no + direction
  }

  // next
  if (direction === 1) {
    store.dispatch('lamp/highlightCursorArrow', 'right')
    // previous
  } else if (direction === -1) {
    store.dispatch('lamp/highlightCursorArrow', 'left')
  }

  const slideNext = slides[params.slideNo - 1]

  if (slideNext.stepCount > 1) {
    params.stepNo = 1
  }

  const name = getNavRouteNameFromRoute(params, router.currentRoute)

  router.push({ name, params })
}

/**
 * Navigate through the steps of a slide by updating the route.
 *
 * @param {Number} direction - `1`: next, `-1`: previous
 */
function goToNextStep (direction) {
  const presentation = store.getters['lamp/presentation']
  if (!presentation) return
  const slide = store.getters['lamp/slide']

  if (!slide.stepCount || slide.stepCount < 2) return

  const params = {
    presRef: presentation.ref,
    slideNo: slide.no
  }

  // next
  if (direction === 1 && slide.stepNo === slide.stepCount) {
    params.stepNo = 1
    // previous
  } else if (direction === -1 && slide.stepNo === 1) {
    params.stepNo = slide.stepCount
  } else {
    params.stepNo = slide.stepNo + direction
  }

  // next
  if (direction === 1) {
    store.dispatch('lamp/highlightCursorArrow', 'down')
    // previous
  } else if (direction === -1) {
    store.dispatch('lamp/highlightCursorArrow', 'up')
  }

  router.push({ name: 'slide-step-no', params })
}

/**
 * Navigate through the presentation by updating the route.
 *
 * @param {Number} direction - `1`: next, `-1`: previous
 */
function goToNextSlideOrStep (direction) {
  const presentation = store.getters['lamp/presentation']
  if (!presentation) return
  const params = store.getters['lamp/nav/nextRouterParams'](direction)
  params.presRef = presentation.ref

  const name = getNavRouteNameFromRoute(params, router.currentRoute)

  // next
  if (direction === 1) {
    if (params.stepNo && params.stepNo !== 1) {
      store.dispatch('lamp/highlightCursorArrow', 'down')
    } else {
      store.dispatch('lamp/highlightCursorArrow', 'right')
    }
    // previous
  } else if (direction === -1) {
    if (
      params.stepNo &&
      params.stepNo !== store.getters['lamp/slide'].stepCount
    ) {
      store.dispatch('lamp/highlightCursorArrow', 'up')
    } else {
      store.dispatch('lamp/highlightCursorArrow', 'left')
    }
  }

  router.push({ name, params })
}

export default {
  resetSlideScaleFactor () {
    store.dispatch('lamp/resetSlideScaleFactor')
  },
  increaseSlideScaleFactor () {
    store.dispatch('lamp/increaseSlideScaleFactor')
  },
  decreaseSlideScaleFactor () {
    store.dispatch('lamp/decreaseSlideScaleFactor')
  },
  toggleSlides () {
    store.dispatch('lamp/setSlideNoToOld')
  },
  async update () {
    try {
      const result = await api.updateMediaServer()
      store.dispatch('lamp/titles/loadRootTreeList')
      if (result.data.errors.length) {
        for (const errorMsg of result.data.errors) {
          showMessage.error(errorMsg)
        }
      } else {
        showMessage.success(
          `Der lokale Medien-Server wurde erfolgreich aktualisiert. Git-Commit-ID: ${result.data.lastCommitId.substring(
            0,
            8
          )}`
        )
      }
    } catch (error) {
      showMessage.error(error)
    }
  },
  openEditor () {
    callOpenRestApi('editor')
  },
  openMedia () {
    const slide = store.getters['lamp/slide']
    if (slide && slide.firstMediaUri) {
      const uri = slide.firstMediaUri.split(':')[1]
      api.openEditor({ ref: uri, type: 'asset' })
    } else {
      vm.$showMessage.error(
        'Die aktuelle Folie hat keine Mediendatei zum Öffnen.'
      )
    }
  },
  openParent () {
    callOpenRestApi('folder')
  },
  openParentArchive () {
    callOpenRestApi('folder', true)
  },
  openEditorParentArchive () {
    callOpenRestApi('editor')
    callOpenRestApi('folder', true, true)
  },
  async reloadPresentation () {
    const presentation = store.getters['lamp/presentation']
    if (!presentation) {
      vm.$showMessage.error('Keine Präsention geladen.')
      return
    }
    try {
      await store.dispatch('lamp/reloadPresentation')
      vm.$showMessage.success('Die Präsentation wurde neu geladen.')
    } catch (error) {
      vm.$showMessage.error(error)
    }
  },
  toggleMetaDataOverlay () {
    store.dispatch('lamp/toggleMetaDataOverlay')
  },
  /**
   * Toggle the speaker view.
   */
  toggleSpeakerView () {
    const route = router.currentRoute
    let name
    const params = route.params
    if (route.name === 'slide') {
      name = 'speaker-view'
    } else if (route.name === 'slide-step-no') {
      name = 'speaker-view-step-no'
    } else if (route.name === 'slides-preview') {
      name = 'speaker-view'
      if (!params.slideNo) {
        params.slideNo = '1'
        delete params.stepNo
      }
    } else if (route.name === 'speaker-view') {
      name = 'slide'
    } else if (route.name === 'speaker-view-step-no') {
      name = 'slide-step-no'
    }
    if (name) router.push({ name, params: route.params })
  },
  toggleMediaOverview () {
    toggleLastRoute('media-overview')
  },
  toggleHome () {
    toggleLastRoute('home')
  },
  toggleSlidesPreview () {
    toggleLastRoute('slides-preview')
  },
  toggleRestApi () {
    toggleLastRoute('rest-api')
  },
  toggleCamera () {
    toggleLastRoute('camera')
  },
  toggleEditor () {
    toggleLastRoute('editor')
  },
  goToPreviousSlide () {
    goToNextSlide(-1)
  },
  goToNextSlide () {
    goToNextSlide(1)
  },
  goToPreviousStep () {
    goToNextStep(-1)
  },
  goToNextStep () {
    goToNextStep(1)
  },
  goToPreviousSlideOrStep () {
    goToNextSlideOrStep(-1)
  },
  goToNextSlideOrStep () {
    goToNextSlideOrStep(1)
  },
  toggleDarkMode () {
    styleConfigurator.toggleDarkMode()
  },
  resetStyles () {
    styleConfigurator.reset()
  },
  enterFullscreen () {
    styleConfigurator.toggleFullscreen()
  },
  togglePlayer () {
    vm.$media.player.toggle()
  },
  startPlayer () {
    vm.$media.player.start()
  },
  stopPlayer () {
    vm.$media.player.stop()
  },
  fadeOutPlayer () {
    vm.$media.player.stop(4)
  },
  startPreviousInPlaylist () {
    vm.$media.playList.startPrevious()
  },
  startNextInPlaylist () {
    vm.$media.playList.startNext()
  },
  forwardPlayer () {
    vm.$media.player.forward()
  },
  backwardPlayer () {
    vm.$media.player.backward()
  }
}
