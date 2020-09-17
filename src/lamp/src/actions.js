/**
 * Wrap some actions into function to make them available for
 * the ipcRenderer of the Electron main process.
 *
 * @module @bldr/lamp/actions
 */

import store from './store/index.js'
import vm from './main.js'
import { router } from './routes.js'

/**
 * Toggle between two routes:
 *
 * 1. The routes named `slide` or `slide-step-no` and
 * 2. the route with the name specified with the argument
 *    `routeNameTo`.
 *
 * If the current route is neither `slides` nor `routeNameTo` move
 * to `routeNameTo`.
 *
 * @param {String} routeNameTo - The route name to move to or move
 *   from.
 */
function toggleSlidesToRoute (routeNameTo) {
  const slide = store.getters['lamp/slide']
  const presentation = store.getters['lamp/presentation']
  if (
    (routeNameTo === 'slide' && !slide) ||
    (routeNameTo === 'slides-preview' && !presentation)
  ) return
  if (router.currentRoute.name !== routeNameTo) {
    router.push({ name: routeNameTo })
  } else if (slide) {
    router.push(slide.routerLocation())
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
    vm.$notifyError(
      'Es ist keine Präsentation geladen.',
      'Der übergeordnete Ordner konnte nicht geöffnet werden.'
    )
    return
  }
  vm.$media.httpRequest.request({
    url: 'mgmt/open',
    params: {
      with: openWith,
      type: 'presentations',
      id: presentation.meta.id,
      archive,
      create
    }
  })
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
      const result = await vm.$media.httpRequest.request('mgmt/update')
      store.dispatch('lamp/updateFolderTitleTree')
      if (result.data.errors.length) {
        for (const errorMsg of result.data.errors) {
          vm.$notifyError(errorMsg)
        }
      } else {
        vm.$notifySuccess(`Der lokale Medien-Server wurde erfolgreich aktualisiert. Git-Commit-ID: ${result.data.lastCommitId.substring(0, 8)}`)
      }
    } catch (error) {
      vm.$notifyError(error)
    }
  },
  openEditor () {
    callOpenRestApi('editor')
  },
  openMedia () {
    const slide = store.getters['lamp/slide']
    if (slide && slide.firstMediaUri) {
      const uri = slide.firstMediaUri.split(':')[1]
      vm.$media.httpRequest.request({
        url: 'mgmt/open',
        params: {
          with: 'editor',
          type: 'assets',
          id: uri
        }
      })
    } else {
      vm.$notifyError('Die aktuelle Folie hat keine Mediendatei zum Öffnen.')
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
      vm.$notifyError('Keine Präsention geladen.')
      return
    }
    try {
      await store.dispatch('lamp/reloadPresentation')
      vm.$notifySuccess('Die Präsentation wurde neu geladen.')
    } catch (error) {
      vm.$notifyError(error)
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
    toggleSlidesToRoute('media-overview')
  },
  toggleHome () {
    toggleSlidesToRoute('home')
  }
}
