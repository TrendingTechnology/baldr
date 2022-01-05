/**
 * Resolve media files. Counter part of the BALDR media server.
 *
 * @module @bldr/media-client
 */

/**
 * A `assetSpec` can be:
 *
 * 1. A remote URI (Uniform Resource Identifier) as a string, for example
 *    `ref:Joseph_haydn` which has to be resolved.
 * 2. A already resolved HTTP URL, for example
 *    `https://example.com/Josef_Haydn.jg`
 * 3. A file object {@link https://developer.mozilla.org/de/docs/Web/API/File}
 *
 * @typedef assetSpec
 * @type {(String|File)}
 */

/**
 * An array of `assetSpec` or a single `assetSpec`
 *
 * @typedef assetSpecs
 * @type {(assetSpec[]|assetSpec)}
 */

/* globals config document Audio Image File */

import { makeHttpRequestInstance } from '@bldr/http-request'
import * as tmpMediaResolver from '@bldr/media-resolver'
import DynamicSelect from '@bldr/dynamic-select'
import { formatDuration } from '@bldr/core-browser'

import storeModule from './store.js'
import { registerComponents } from './components.js'
import { addRoutes } from './routes.js'

export const httpRequest = makeHttpRequestInstance(config, 'automatic','/api/media')

export const mediaResolver = tmpMediaResolver

/**
 * The {@link https://vuex.vuejs.org/ vuex} store instance.
 * @type {Object}
 */
export let store

/**
 * A {@link https://router.vuejs.org/ vue router instance.}
 *
 * @type {Object}
 */
export let router

/**
 * A instance of the class `Shortcuts()`.
 *
 * @type {module:@bldr/shortcuts~Shortcuts}
 */
export let shortcuts

/**
 * Manage (hide and show) the media canvas, a fullscreen area to show
 * videos or images which are launched with the short cuts `v 1`, `v 2` or
 * `i 1` etc.
 */
class Canvas {
  constructor () {
    this.selectorWrapper_ = '.vc_media_canvas'
    this.selectorMain_ = '#media-canvas-main'
  }

  get elementWrapper_ () {
    return document.querySelector(this.selectorWrapper_)
  }

  get elementMain_ () {
    return document.querySelector(this.selectorMain_)
  }

  hide () {
    this.elementWrapper_.style.display = 'none'
    this.elementMain_.innerHTML = ''
  }

  show (mediaElement) {
    this.elementWrapper_.style.display = 'block'
    if (mediaElement) {
      this.elementMain_.innerHTML = ''
      this.elementMain_.appendChild(mediaElement)
    }
  }
}

/**
 * An instance of this class gets exported as a Vue plugin. Access methods
 * and sub classes using the Vue instance property `$media`:
 *
 * ```js
 * this.$media.player.play()
 * ```
 */
class Media {
  constructor () {
    /**
     *  @type {module:@bldr/http-request.HttpRequest}
     */
    this.httpRequest = httpRequest

    /**
     * @type {module:@bldr/media-client~Canvas}
     */
    this.canvas = new Canvas()
  }

  /**
   * Resolve media files by URIs. The media file gets stored in the vuex
   * store module `media`. Use getters to access the `asset` objects.
   *
   * @param {module:@bldr/media-client~assetSpecs} assetSpecs
   * @param {Boolean} throwException - Throw an exception if the media URI
   *  cannot be resolved (default: `true`).
   *
   * @returns {Object}
   */
  async resolve (assetSpecs, throwException = true) {
    const assets = await mediaResolver.resolve(assetSpecs, throwException)
    for (const asset of assets) {
      store.commit('media/addAsset', asset)
      if (asset.samples != null) {
        for (const sample of asset.samples) {
          store.commit('media/addSample', sample)
        }
      }
    }
  }

  registerAssetShortcut (asset) {
    if (asset.shortcut == null) return
    shortcuts.add(
      asset.shortcut,
      () => {
        this.canvas.hide()
        this.player.stop()
        console.log(asset)
        this.canvas.show(asset.htmlElement)
      },
      `Zeige Bild  „${asset.titleSafe}“`
    )
  }
}

export let media

// https://stackoverflow.com/a/56501461
// Vue.use(media, router, store, shortcuts)
const Plugin = {
  install (Vue, routerInstance, storeInstance, shortcutsInstance) {
    if (!routerInstance) throw new Error('Pass in an instance of “VueRouter”.')
    router = routerInstance

    if (!storeInstance) throw new Error('Pass in an instance of “Vuex Store”.')
    store = storeInstance
    store.registerModule('media', storeModule)

    if (!shortcutsInstance) throw new Error('Pass in an instance of “Shortcuts“.')
    shortcuts = shortcutsInstance

    addRoutes(router, shortcuts)

    Vue.use(DynamicSelect)

    Vue.filter('duration', formatDuration)
    media = new Media()
    /**
     * $media
     * @memberof module:@bldr/lamp~Vue
     * @type {module:@bldr/media-client~Media}
     */
    Vue.prototype.$media = media
    registerComponents(Vue)
  }
}

export default Plugin
