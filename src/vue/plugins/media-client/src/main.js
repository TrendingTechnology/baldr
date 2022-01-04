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
 * A deeply with vuex coupled media player. Only one media file can be
 * played a the same time.
 */
class Player {
  constructor () {
    /**
     * Global volume: from 0 - 1
     *
     * @type {Number}
     */
    this.globalVolume = 1

    /**
     * @type {module:@bldr/media-client~CustomEvents}
     */
    this.events = new CustomEvents()
  }

  get samplePlaying () {
    return store.getters['media/samplePlaying']
  }

  set samplePlaying (sample) {
    store.dispatch('media/setSamplePlaying', sample)
  }

  get sampleLoaded () {
    return store.getters['media/sampleLoaded']
  }

  set sampleLoaded (sample) {
    store.commit('media/setSampleLoaded', sample)
  }

  /**
   * Load a sample. Only loaded sample can be played.
   *
   * @param {String|Object} uriOrSample
   */
  load (uriOrSample) {
    let sample
    if (typeof uriOrSample === 'object') {
      sample = uriOrSample
    } else {
      let uri = uriOrSample
      if (uri.indexOf('#') === -1) uri = `${uri}#complete`
      sample = store.getters['media/sampleByUri'](uri)
    }
    if (!sample) throw new Error(`The sample “${uriOrSample}” couldn’t be played!`)
    this.sampleLoaded = sample
  }

  /**
   * Play a loaded sample from the position `sample.startTimeSec` on. Stop the
   * currently playing sample.
   */
  async start () {
    const loaded = this.sampleLoaded
    if (!loaded) throw new Error('First load a sample')
    this.events.trigger('start', loaded)
    const playing = this.samplePlaying
    if (playing) await playing.stop()
    this.samplePlaying = loaded
    loaded.start(this.globalVolume)
  }

  /**
   * Stop the playback and reset the play position to `sample.startTimeSec` and
   * unload the playing sample.
   *
   * @param {Number} fadeOutSec - Duration in seconds to fade out the sample.
   */
  async stop (fadeOutSec) {
    const playing = this.samplePlaying
    if (!playing) return
    await playing.stop(fadeOutSec)
    this.samplePlaying = null
  }

  /**
   * Pause a sample at the current position.
   */
  async pause () {
    const playing = this.samplePlaying
    if (!playing || !playing.mediaElement) return
    await playing.pause()
  }

  /**
   * Jump forwards.
   *
   * @param {Number} interval - Time interval in seconds.
   */
  forward (interval = 10) {
    this.samplePlaying.forward(interval)
  }

  /**
   * Jump backwards.
   *
   * @param {Number} interval - Time interval in seconds.
   */
  backward (interval = 10) {
    this.samplePlaying.backward(interval)
  }

  /**
   * Toggle between `Player.pause()` and `Player.play()`. If a sample is loaded
   * start this sample.
   */
  toggle () {
    const playing = this.samplePlaying
    if (!playing) {
      this.start()
      return
    }
    playing.toggle(this.globalVolume)
  }
}

/**
 * A class to manage a playlist of samples. As a store backend the vuex store
 * is used.
 */
class PlayList {
  /**
   * @param {object} store - The {@link https://vuex.vuejs.org/ vuex} store
   *   instance.
   *
   * @param {module:@bldr/media-client~Player} player
   */
  constructor (player) {
    /**
     * @type {module:@bldr/media-client~Player}
     */
    this.player = player
  }

  /**
   * @private
   */
  start_ () {
    const sample = store.getters['media/samplePlayListCurrent']
    this.player.load(sample)
    this.player.start()
  }

  /**
   * Start the previous sample in the playlist.
   */
  startPrevious () {
    store.dispatch('media/setPlayListSamplePrevious')
    this.start_()
  }

  /**
   * Start the next sample in the playlist.
   */
  startNext () {
    store.dispatch('media/setPlayListSampleNext')
    this.start_()
  }
}

/**
 * A simple wrapper class for a custom event system. Used in the classes
 * `Sample()` and `Player()`.
 */
class CustomEvents {
  constructor () {
    /**
     * An object of callback functions
     *
     * @type {Object}
     */
    this.callbacks_ = {}
  }

  /**
   * Trigger a custom event.
   *
   * @param {String} name - The name of the event. Should be in lowercase, for
   *   example `fadeoutbegin`.
   * @param {Mixed} args - One ore more additonal arguments to pass through
   *   the callbacks.
   */
  trigger (name) {
    const args = Array.from(arguments)
    args.shift()
    if (!(name in this.callbacks_)) {
      this.callbacks_[name] = []
    }
    for (const callback of this.callbacks_[name]) {
      callback.apply(null, args)
    }
  }

  /**
   * Register callbacks for specific custom event.
   *
   * @param {String} name - The name of the event. Should be in lowercase, for
   *   example `fadeoutbegin`.
   * @param {Function} callback - A function which gets called when the
   *   event is triggered.
   */
  on (name, callback) {
    if (!(name in this.callbacks_)) {
      this.callbacks_[name] = []
    }
    this.callbacks_[name].push(callback)
  }
}

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
     * @type {module:@bldr/media-client~Player}
     */
    this.player = new Player()

    /**
     * @type {module:@bldr/media-client~PlayList}
     */
    this.playList = new PlayList(this.player)

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
      this.registerAssetShortcut(asset)
      store.commit('media/addAsset', asset)
      if (asset.samples != null) {
        for (const sample of asset.samples) {
          store.commit('media/addSample', sample)
        }
      }
    }
  }

  registerSampleShortcut (sample) {
    if (sample.shortcut == null) return
    shortcuts.add(
      sample.shortcut,
      () => {
        // TODO: Start the same video twice behaves very strange.
        this.canvas.hide()
        this.player.load(sample.ref)
        this.player.start()
        if (sample.asset.isVisible) {
          this.canvas.show(sample.htmlElement)
        }
      },
      `Spiele Ausschnitt „${sample.titleSafe}“`
    )
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
