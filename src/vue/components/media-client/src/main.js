/**
 * Resolve media files. Counter part of the BALDR media server.
 *
 * @module @bldr/media-client
 */

/**
 * A `assetSpec` can be:
 *
 * 1. A remote URI (Uniform Resource Identifier) as a string, for example
 *    `id:Joseph_haydn` which has to be resolved.
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
import {
  MediaCategoriesManager,
  convertDurationToSeconds,
  formatMultiPartAssetFileName,
  mediaUriRegExp,
  convertHtmlToPlainText,
  selectSubset
} from '@bldr/core-browser'

import DynamicSelect from '@bldr/dynamic-select'

// Vue components
import ComponentClientMediaAsset from './MediaAsset.vue'
import ComponentMediaOverview from './MediaOverview/index.vue'
import ComponentMediaPlayer from './MediaPlayer.vue'
import ComponentHorizontalPlayButtons from './HorizontalPlayButtons.vue'
import ComponentMediaCanvas from './MediaCanvas.vue'
import ComponentPlayButton from './PlayButton.vue'
import storeModule from './store.js'

export const httpRequest = makeHttpRequestInstance(config, 'automatic','/api/media')

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
 *
 */
export const mediaCategoriesManager = new MediaCategoriesManager(config)

/**
 * Extract media URIs from an object to allow linked media assets inside
 * from media assets itself.
 *
 * ```yml
 * ---
 * title: Für Elise
 * id: HB_Fuer-Elise
 * cover: id:BD_Feuer-Elise
 * ```
 *
 * @param {Object} object - For example from the YAML files.
 * @param {Array} uris - The target array to collect all found media URIs.
 *
 * @returns {Array}
 */
function extractMediaUrisRecursive (object, urisStore) {
  /**
   *
   * @param {String} uri - A string to test if it is a media URI (`id:Sample1_HB`)
   *
   * @returns {Boolean}
   */
  function isMediaUri (uri) {
    if (uri && typeof uri === 'string' && uri.match(mediaUriRegExp)) {
      return true
    }
    return false
  }

  /**
   * @param {Mixed} value - A mixed type value to test if it is a media URI.
   * @param {Array} urisStore - Target array to store the media URIs.
   */
  function collectMediaUri (value, urisStore) {
    if (isMediaUri(value) && !urisStore.includes(value)) {
      urisStore.push(value)
    }
  }

  // Array
  if (Array.isArray(object)) {
    for (const value of object) {
      if (typeof object === 'object') {
        extractMediaUrisRecursive(value, urisStore)
      } else {
        collectMediaUri(value, urisStore)
      }
    }
  // Object
  } else if (typeof object === 'object') {
    for (const property in object) {
      if (typeof object[property] === 'object') {
        extractMediaUrisRecursive(object[property], urisStore)
      } else {
        collectMediaUri(object[property], urisStore)
      }
    }
  } else {
    collectMediaUri(object, urisStore)
  }
}

/**
 * Remove duplicates from an array. A new array is created an returns
 *
 * @param {Array} input - An array with possible duplicate entries.
 *
 * @returns {Array} - The new array with no duplicates.
 */
function removeDuplicatesFromArray (input) {
  const output = []
  for (const value of input) {
    if (!output.includes(value)) {
      output.push(value)
    }
  }
  return output
}

/**
 * @param {String} duration - in seconds
 *
 * @return {String}
 */
export function formatDuration (duration) {
  if (!duration || duration <= 0) return '00:00'
  duration = parseInt(duration)
  let seconds = duration % 60
  if (seconds < 10) {
    seconds = `0${seconds}`
  }
  let minutes = parseInt(duration / 60)
  if (minutes < 10) {
    minutes = `0${minutes}`
  }
  return `${minutes}:${seconds}`
}

class Timers {
  constructor () {
    /**
     * An array of `setTimeout` IDs.
     *
     * @type {Array}
     */
    this.ids_ = []
  }
}

/**
 * We have to clear the timeouts. A not yet finished playbook with a
 * duration - stopped to early - cases that the next playback gets stopped
 * to early.
 */
class TimeOut extends Timers {
  set (func, delay) {
    this.ids_.push(setTimeout(func, parseInt(delay)))
  }

  clear () {
    for (const id of this.ids_) {
      clearTimeout(id)
    }
  }
}

/**
 * Wrapper class around the function `setInterval` to store the `id`s returned
 * by the function to be able to clear the function.
 */
class Interval extends Timers {
  /**
   * Repeatedly call a function.
   *
   * @param {Function} func - A function to be executed every delay
   *   milliseconds.
   * @param {Number} delay - The time, in milliseconds (thousandths of a
   *   second), the timer should delay in between executions of the specified
   *   function or code.
   */
  set (func, delay) {
    this.ids_.push(setInterval(func, parseInt(delay)))
  }

  /**
   * Cancel a timed, repeating action which was previously established by a
   * call to set().
   */
  clear () {
    for (const id of this.ids_) {
      clearInterval(id)
    }
  }
}

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
 * A sample (snippet, sprite) of a media file which can be played. A sample
 * has typically a start time and a duration. If the start time is missing, the
 * media file gets played from the beginning. If the duration is missing, the
 * whole media file gets played.
 *
 * ```
 *                  currentTimeSec
 *                  |
 *  fadeIn          |        fadeOut
 *         /|-------+------|\           <- mediaElementCurrentVolume_
 *      /   |       |      |   \
 *   /      |       |      |     \
 * #|#######|#######|######|#####|#### <- mediaElement
 *  ^                            ^
 *  startTimeSec                 endTimeSec
 *                         ^
 *                         |
 *                         fadeOutStartTime
 *
 *  | <-      durationSec      ->|
 * ```
 */
class Sample {
  /**
   * @param {ClientMediaAsset} asset
   * @param {object} specs
   * @property {String} specs.title
   * @property {String|Number} specs.id
   * @property {String|Number} specs.startTime - The start time in seconds.
   * @property {String|Number} specs.fadeIn - The fade in time in seconds. The
   *   duration is not affected by this time specification.
   * @property {String|Number} specs.duration - The duration in seconds of
   *   the sample.
   * @property {String|Number} specs.fadeOut - The fade out time in seconds. The
   *   duration is not affected by this time specification.
   * @property {String|Number} specs.endTime - The end time in seconds.
   * @property {String} specs.shortcut - A custom shortcut
   */
  constructor (asset, { title, id, startTime, fadeIn, duration, fadeOut, endTime, shortcut }) {
    /**
     * We fade in very short and smoothly to avoid audio artefacts.
     *
     * @type {Number}
     */
    this.defaultFadeInSec = 0.3

    /**
     * We never stop. Instead we fade out very short and smoothly.
     *
     * @type {Number}
     */
    this.defaultFadeOutSec = 1

    /**
     * Number of milliseconds to wait before the media file is played.
     *
     * @type {Number}
     */
    this.defaultPlayDelayMsec = 10

    /**
     * The parent media file object.
     *
     * @type {module:@bldr/media-client.ClientMediaAsset}
     */
    this.asset = asset

    /**
     * The corresponding HTML media element, a object of the
     * corresponding `<audio/>` or `<video/>` element.
     *
     * @type {HTMLMediaElement}
     */
    this.mediaElement = null

    /**
     * The title of the sample. For example `komplett`, `Hook-Line`.
     *
     * @type {String}
     */
    this.title = title

    if (!id) throw new Error('A sample needs an id.')

    /**
     * The ID of the sample. The ID is used to build the URI of the sample, for
     * example `uri#id`: `id:Beethoven#complete`
     *
     * @type {String}
     */
    this.id = id

    /**
     * The URI of the sample in the format `uri#id`: for example
     * `id:Beethoven#complete`
     *
     * @type {String}
     */
    this.uri = `${this.asset.uri}#${id}`

    /**
     * The start time in seconds. The sample is played from this start time
     * using the `mediaElement` of the `asset`. It is the “zero” second
     * for the sample.
     *
     * @type {Number}
     */
    this.startTimeSec = this.toSec_(startTime)

    if (duration && endTime) {
      throw new Error('Specifiy duration or endTime not both. They are mutually exclusive.')
    }

    /**
     * Use the getter functions `sample.durationSec`.
     * @private
     * @type {Number}
     */
    this.durationSec_ = null
    duration = this.toSec_(duration)
    if (duration) {
      this.durationSec_ = duration
    } else if (endTime) {
      this.durationSec_ = this.toSec_(endTime) - this.startTimeSec
    }

    if (fadeIn) {
      /**
       * Use the getter function `sample.fadeInSec`
       * @private
       * @type {Number}
       */
      this.fadeInSec_ = this.toSec_(fadeIn)
    }

    if (fadeOut) {
      /**
       * Use the getter function `sample.fadeOutSec`
       * @private
       * @type {Number}
       */
      this.fadeOutSec_ = this.toSec_(fadeOut)
    }

    /**
     * The current volume of the parent media Element. This value gets stored
     * when the sample is paused. It is needed to restore the volume.
     *
     * @private
     * @type {Number}
     */
    this.mediaElementCurrentVolume_ = null

    /**
     * The current time of the parent media Element. This value gets stored
     * when the sample is paused.
     *
     * @private
     * @type {Number}
     */
    this.mediaElementCurrentTimeSec_ = null

    /**
     * The actual shortcut. If `shortcutCustom` is set, it is the same as this
     * value.
     *
     * @type {Number}
     */
    this.shortcut = null

    /**
     * The shortcut number. 1 means: To play the sample type in “a 1” if it
     * is a audio file or “v 1” if it is a video file.
     *
     * @type {Number}
     */
    this.shortcutNo = null

    /**
     * A custom shortcut, for example “k 1”
     *
     * @type {String}
     */
    this.shortcutCustom = shortcut

    /**
     * @type {module:@bldr/media-client~Interval}
     * @private
     */
    this.interval_ = new Interval()

    /**
     * @type {module:@bldr/media-client~TimeOut}
     * @private
     */
    this.timeOut_ = new TimeOut()

    /**
     * @type {module:@bldr/media-client~CustomEvents}
     */
    this.events = new CustomEvents()

    /**
     * The state of the current playback.
     *
     * - started
     * - fadein
     * - playing
     * - fadeout
     * - stopped
     */
    this.playbackState = 'stopped'
  }

  /**
   * The URI using the `id` authority.
   *
   * @returns {String}
   */
  get uriId () {
    return `${this.asset.uriId}#${this.id}`
  }

  /**
   * The URI using the `uuid` authority.
   *
   * @returns {String}
   */
  get uriUuid () {
    return `${this.asset.uriUuid}#${this.id}`
  }

  /**
   * If the sample is the complete media file get the title of the media file.
   * For example `Glocken (Das große Tor von Kiew)`
   *
   * @type {String}
   */
  get titleSafe () {
    if (this.id === 'complete') {
      return this.asset.titleSafe
    } else {
      return `${this.title} (${this.asset.titleSafe})`
    }
  }

  /**
   * Combined value build from `this.asset.artist` and `this.asset.composer`.
   *
   * @returns {String}
   */
  get artistSafe () {
    let artist, composer
    if (this.asset.artist) {
      artist = `<em class="person">${this.asset.artist}</em>`
    }
    if (this.asset.composer) {
      composer = `<em class="person">${this.asset.composer}</em>`
    }
    if (artist === composer) {
      return artist
    } else if (artist && composer) {
      return `${composer} (${artist})`
    } else if (artist && !composer) {
      return artist
    } else if (!artist && composer) {
      return composer
    }
  }

  /**
   * Combined value build from `this.asset.creationDate` and `this.asset.year`.
   *
   * @returns {String}
   */
  get yearSafe() {
    const a = this.asset
    if (a.creationDate) {
      return a.creationDate
    } else if (a.year) {
      return a.year
    }
  }

  /**
   * Convert strings to numbers, so we can use them as seconds.
   *
   * @param {String|Number} timeIntervaleString
   *
   * @private
   */
  toSec_ (timeIntervaleString) {
    return convertDurationToSeconds(timeIntervaleString)
  }

  /**
   * The current time of the sample. It starts from zero.
   *
   * @type {Number}
   */
  get currentTimeSec () {
    return this.mediaElement.currentTime - this.startTimeSec
  }

  /**
   * Time in seconds to fade in.
   *
   * @type {Number}
   */
  get fadeInSec () {
    if (!this.fadeInSec_) {
      return this.router
    } else {
      return this.fadeInSec_
    }
  }

  /**
   * Time in seconds to fade out.
   *
   * @type {Number}
   */
  get fadeOutSec () {
    if (!this.fadeOutSec_) {
      return this.defaultFadeOutSec
    } else {
      return this.fadeOutSec_
    }
  }

  /**
   * In how many milliseconds we have to start a fade out process.
   *
   * @private
   */
  get fadeOutStartTimeMsec_ () {
    return (this.durationRemainingSec - this.fadeOutSec) * 1000
  }

  /**
   * The duration of the sample in seconds. If the duration is set on the
   * sample, it is the same as `sample.durationSec_`.
   *
   * @type {Number}
   */
  get durationSec () {
    if (!this.durationSec_) {
      // Samples without duration play until the end fo the media file.
      return this.mediaElement.duration - this.startTimeSec
    } else {
      return this.durationSec_
    }
  }

  /**
   * The remaining duration of the sample in seconds.
   *
   * @type {Number}
   */
  get durationRemainingSec () {
    return this.durationSec - this.currentTimeSec
  }

  /**
   * A number between 0 and 1. 0: the sample starts from the beginning. 1:
   * the sample reaches the end.
   *
   * @type {Number}
   */
  get progress () {
    // for example:
    // current time: 6s duration: 60s
    // 6 / 60 = 0.1
    return this.currentTimeSec / this.durationSec
  }

  /**
   * Set the volume and simultaneously the opacity of a video element, to be
   * able to fade out or fade in a video and a audio file.
   */
  set volume (value) {
    this.mediaElement.volume = value.toFixed(2)
    if (this.asset.assetType === 'video') {
      this.mediaElement.style.opacity = value.toFixed(2)
    }
  }

  /**
   * Fade in. Set the volume to 0 and reach after a time intervale, specified
   * with `duration` the `targetVolume.`
   *
   * @param {Number} targetVolume - End volume value of the fade in process. A
   *   number from 0 - 1.
   * @param {Number} duration - in seconds
   *
   * @async
   *
   * @returns {Promise}
   */
  fadeIn (targetVolume = 1, duration) {
    if (!targetVolume) targetVolume = 1
    if (!duration) duration = this.defaultFadeInSec
    return new Promise((resolve, reject) => {
      // Fade in can triggered when a fade out process is started and
      // not yet finished.
      this.interval_.clear()
      this.events.trigger('fadeinbegin')
      this.playbackState = 'fadein'
      let actualVolume = 0
      this.mediaElement.volume = 0
      this.mediaElement.play()
      // Normally 0.01 by volume = 1
      const steps = targetVolume / 100
      // Interval: every X ms reduce volume by step
      // in milliseconds: duration * 1000 / 100
      const stepInterval = duration * 10
      this.interval_.set(() => {
        actualVolume += steps
        if (actualVolume <= targetVolume) {
          this.volume = actualVolume
        } else {
          this.interval_.clear()
          this.events.trigger('fadeinend')
          this.playbackState = 'playing'
          resolve()
        }
      }, stepInterval)
    })
  }

  /**
   * Start and play a sample from the beginning.
   *
   * @param {Number} targetVolume - End volume value of the fade in process. A
   *   number from 0 - 1.
   */
  start (targetVolume) {
    this.playbackState = 'started'
    this.play(targetVolume, this.startTimeSec)
  }

  /**
   * Play a sample from `startTimeSec`.
   *
   * @param {Number} targetVolume - End volume value of the fade in process. A
   *   number from 0 - 1.
   * @param {Number} startTimeSec - Position in the sample from where to play
   *   the sample
   */
  play (targetVolume, startTimeSec, fadeInSec) {
    if (!fadeInSec) fadeInSec = this.fadeInSec
    // The start() triggers play with this.startTimeSec. “complete” samples
    // have on this.startTimeSec 0.
    if (startTimeSec || startTimeSec === 0) {
      this.mediaElement.currentTime = startTimeSec
    } else if (this.mediaElementCurrentTimeSec_) {
      this.mediaElement.currentTime = this.mediaElementCurrentTimeSec_
    } else {
      this.mediaElement.currentTime = this.startTimeSec
    }

    // To prevent AbortError in Firefox, artefacts when switching through the
    // audio files.
    this.timeOut_.set(() => {
      this.fadeIn(targetVolume, this.fadeInSec)
      this.scheduleFadeOut_()
    }, this.defaultPlayDelayMsec)
  }

  /**
   * Schedule when the fade out process has to start.
   * Always fade out at the end. Maybe the samples are cut without a
   * fade out.
   * @private
   */
  scheduleFadeOut_ () {
    this.timeOut_.set(
      () => { this.fadeOut(this.fadeOutSec) },
      this.fadeOutStartTimeMsec_
    )
  }

  /**
   * @param {Number} duration - in seconds
   *
   * @async
   *
   * @returns {Promise}
   */
  fadeOut (duration) {
    if (!duration) duration = this.defaultFadeOutSec
    return new Promise((resolve, reject) => {
      if (this.mediaElement.paused) resolve()
      // Fade out can triggered when a fade out process is started and
      // not yet finished.
      this.interval_.clear()
      this.events.trigger('fadeoutbegin')
      this.playbackState = 'fadeout'
      // Number from 0 - 1
      let actualVolume = this.mediaElement.volume
      // Normally 0.01 by volume = 1
      const steps = actualVolume / 100
      // Interval: every X ms reduce volume by step
      // in milliseconds: duration * 1000 / 100
      const stepInterval = duration * 10
      this.interval_.set(() => {
        actualVolume -= steps
        if (actualVolume >= 0) {
          this.volume = actualVolume
        } else {
          // The video opacity must be set to zero.
          this.volume = 0
          this.mediaElement.pause()
          this.interval_.clear()
          this.events.trigger('fadeoutend')
          this.playbackState = 'stopped'
          resolve()
        }
      }, stepInterval)
    })
  }

  /**
   * Stop the playback of a sample and reset the current play position to the
   * beginning of the sample. If the sample is a video, show the poster
   * (the preview image) again by triggering the `load()` method of the
   * corresponding media element.
   *
   * @param {Number} fadeOutSec - Duration in seconds to fade out the sample.
   */
  async stop (fadeOutSec) {
    if (this.mediaElement.paused) return
    await this.fadeOut(fadeOutSec)
    this.mediaElement.currentTime = this.startTimeSec
    this.timeOut_.clear()
    if (this.asset.assetType === 'video') {
      this.mediaElement.load()
      this.mediaElement.style.opacity = 1
    }
  }

  /**
   * Pause the sample at the current position and set the video element to
   * opacity 0. The properties `mediaElementCurrentTimeSec_` and
   * `mediaElementCurrentVolume_` are set or
   * updated.
   */
  async pause () {
    await this.fadeOut()
    this.timeOut_.clear()
    if (this.asset.assetType === 'video') {
      this.mediaElement.style.opacity = 0
    }
    this.mediaElementCurrentTimeSec_ = this.mediaElement.currentTime
    this.mediaElementCurrentVolume_ = this.mediaElement.volume
  }

  /**
   * Toggle between `sample.pause()` and `sample.play()`. If a sample is loaded
   * start this sample.
   */
  toggle (targetVolume = 1) {
    if (this.mediaElement.paused) {
      this.play(targetVolume)
    } else {
      this.pause()
    }
  }

  /**
   * Jump to a new time position.
   *
   * @param {Number} interval - Time interval in seconds.
   * @param {String} direction - `forward` or `backward`
   *
   * @private
   */
  jump_ (interval = 10, direction = 'forward') {
    let newPlayPosition
    const cur = this.currentTimeSec
    if (direction === 'backward') {
      if (cur - interval > 0) {
        newPlayPosition = cur - interval
      } else {
        newPlayPosition = 0
      }
    } else {
      newPlayPosition = this.currentTimeSec + interval
      if (cur + interval < this.durationSec) {
        newPlayPosition = cur + interval
      } else {
        newPlayPosition = this.durationSec
      }
    }
    this.timeOut_.clear()
    this.mediaElement.currentTime = this.startTimeSec + newPlayPosition
    this.scheduleFadeOut_()
  }

  /**
   * Jump forwards.
   *
   * @param {Number} interval - Time interval in seconds.
   */
  forward (interval = 10) {
    this.jump_(interval, 'forward')
  }

  /**
   * Jump backwards.
   *
   * @param {Number} interval - Time interval in seconds.
   */
  backward (interval = 10) {
    this.jump_(interval, 'backward')
  }
}

/**
 * Wrap a sample with some meta data (mostly a custom title). Allow different
 * input specifications.
 *
 * @see {@link module:@bldr/media-client.WrappedSampleList}
 * @see {@link module:@bldr/lamp/content-file~AudioOverlay}
 */
class WrappedSample {
  /**
   * @param {Object|String} spec - Different input specifications are
   *   possible:
   *
   *   1. The sample URI as a string (for example: `id:Fuer-Elise_HB`).
   *   2. The sample URI inside the title text. (for example
   *      `id:Fuer-Elise_HB Für Elise` or `Für Elise id:Fuer-Elise_HB`)
   *   3. An object with the mandatory property `uri` (for example:
   *      `{ uri: 'id:Fuer-Elise_HB'}`).
   *   4. An instance of the class `Sample`.
   */
  constructor (spec) {
    /**
     * @type {module:@bldr/media-client~Sample}
     * @private
     */
    this.sample_ = null

    /**
     * The manually set title.
     *
     * @type {String}
     * @private
     */
    this.title_ = null

    /**
     * True if the title is set manually.
     *
     * This specification sets the property to `true`.
     * `{ title: 'My Title', uri: 'id:Fuer-Elise' }`
     *
     * @type {Boolean}
     */
    this.isTitleSetManually = false

    /**
     * The URI of a samples.
     *
     * @type {String}
     */
    this.uri = null
    if (typeof spec === 'string') {
      if (spec.match(mediaUriRegExp)) {
        this.uri = spec.match(mediaUriRegExp)[0]
        let title = spec.replace(mediaUriRegExp, '')
        if (title) {
          title = title.trim()
          this.title_ = title
          this.isTitleSetManually = true
        }
      } else {
        throw new Error(`No media URI found in “${spec}”!`)
      }
    } else if (spec.uri && !spec.sample) {
      this.uri = spec.uri
    } else if (spec.constructor.name === 'Sample') {
      this.uri = spec.uri
      this.sample_ = spec
    }

    if (spec.title) {
      this.isTitleSetManually = true
      this.title_ = spec.title
    }
  }

  /**
   * The manually set title or, if not set, the `title` of the `sample`.
   *
   * We have to use a getter, because the sample may not be resolved at
   * the constructor time.
   *
   * @returns {String}
   */
  get title () {
    if (this.title_) return this.title_
    if (this.sample && this.sample.title) return this.sample.title
  }

  /**
   * The manually set title or, if not set, the `titleSafe` of the `sample`.
   *
   * We have to use a getter, because the sample may not be resolved at
   * the constructor time.
   *
   * @returns {String}
   */
  get titleSafe () {
    if (this.title_) return this.title_
    if (this.sample && this.sample.titleSafe) return this.sample.titleSafe
  }

  /**
   * We have to use a getter, because the sample may not be resolved at
   * the constructor time.
   *
   * @returns {module:@bldr/media-client~Sample}
   */
  get sample () {
    if (this.sample_) return this.sample_
    return store.getters['media/sampleByUri'](this.uri)
  }
}

/**
 * Wrap some samples with metadata. Allow fuzzy specification of the samples.
 * Normalize the input.
 *
 * @see {@link module:@bldr/media-client~WrappedSample}
 * @see {@link module:@bldr/lamp/content-file~AudioOverlay}
 */
export class WrappedSampleList {
  /**
   * @param {Object|String|Array} spec - Different input specifications are
   *   possible:
   *
   *   1. The sample URI as a string (for example: `id:Fuer-Elise_HB`).
   *   2. An object with the mandatory property `uri` (for example:
   *      `{ uri: 'id:Fuer-Elise_HB'}`).
   *   3. An instance of the class `Sample`.
   *   4. An array
   */
  constructor (spec) {
    // Make sure we have an array.
    let specArray
    if (!Array.isArray(spec)) {
      specArray = [spec]
    } else {
      specArray = spec
    }

    /**
     * An array of instances of the class `WrappedSample`
     * @type {Array}
     */
    this.samples = []
    for (const sampleSpec of specArray) {
      this.samples.push(new WrappedSample(sampleSpec))
    }

    /**
     * True if the title of the first sample is set manually.
     *
     * This specification sets the property to `true`.
     * `{ title: 'My Title', uri: 'id:Fuer-Elise' }`
     *
     * @type {Boolean}
     */
    this.isTitleSetManually = false
    if (this.samples[0].isTitleSetManually) {
      this.isTitleSetManually = true
    }
  }

  /**
   * Get the URI of all wrapped samples.
   *
   * @returns {Array}
   */
  get uris () {
    const uris = []
    for (const wrappedSample of this.samples) {
      uris.push(wrappedSample.uri)
    }
    return uris
  }
}

/**
 * Hold various data of a media file as class properties.
 *
 * If a media file has a property with the name `multiPartCount` set, it is a
 * multi part asset. A multi part asset can be restricted to one part only by a
 * URI fragment (for example `#2`). The URI `id:Score#2` resolves always to the
 * HTTP URL `http:/example/media/Score_no02.png`.
 *
 * @property {string} uri - Uniform Resource Identifier, for example `id:Haydn`,
 *   or `http://example.com/Haydn_Joseph.jpg`.
 * @property {string} uriScheme - for example: `http`, `https`, `blob`
 * @property {string} uriAuthority - for example:
 *   `//example.com/Haydn_Joseph.jpg`.
 * @property {string} httpUrl - HTTP Uniform Resource Locator, for example
 *   `http://example.com/Haydn_Joseph.jpg`.
 * @property {string} path - The relative path on the HTTP server, for example
 *   `composer/Haydn_Joseph.jpg`.
 * @property {string} filename - The file name, for example `Haydn_Joseph.jpg`.
 * @property {string} extension - The file extension, for example `jpg`.
 * @property {string} id - An identifier, for example `Haydn_Joseph`.
 * @property {string} type - The media type, for example `image`, `audio` or
 *   `video`.
 * @property {string} previewHttpUrl - Each media file can have a preview image.
 *   On the path is `_preview.jpg` appended.
 * @property {string} shortcut - The keyboard shortcut to play the media.
 * @property {Object} samples - An object of Sample instances.
 * @property {Number} multiPartCount - The of count of parts if the media file
 *   is a multi part asset.
 * @property {String} cover - An media URI of a image to use a preview image
 *   for mainly audio files. Video files are also supported.
 */
export class ClientMediaAsset {
  /**
   * @param {object} mediaData - A mandatory property is: `uri`
   */
  constructor (mediaData) {
    for (const property in mediaData) {
      this[property] = mediaData[property]
    }
    if (!('uri' in this)) {
      throw new Error('Media file needs a uri property.')
    }

    /**
     * The raw URI unformatted, possible with a fragment (`#2`) to restrict
     * multi part assets.
     *
     * @type {String}
     */
    this.uriRaw = this.uri

    /**
     * Uniform Resource Identifier, for example  `id:Haydn`, or
     * `http://example.com/Haydn_Joseph.jpg`. The sample addition (`#complete`)
     * is removed.
     *
     * @type {string}
     */
    this.uri = decodeURI(this.uri.replace(/#.*$/, ''))
    const segments = this.uri.split(':')

    /**
     * for example: `id`, `uuid`, `http`, `https`, `blob`
     * @type {string}
     */
    this.uriScheme = segments[0]

    /**
     * for example: `//example.com/Haydn_Joseph.jpg`.
     * @type {string}
     */
    this.uriAuthority = segments[1]

    if ('filename' in this && !('extension' in this)) {
      this.extensionFromString(this.filename)
    }
    if ('extension' in this && !('type' in this)) {
      /**
       * The media type, for example `image`, `audio` or `video`.
       * @type {string}
       */
      this.type = mediaCategoriesManager.extensionToType(this.extension)
    }

    /**
     * The keyboard shortcut to play the media
     * @type {string}
     */
    this.shortcut = null

    /**
     * The HTMLMediaElement of the media file.
     * @type {object}
     */
    this.mediaElement = null
  }

  /**
   * The URI using the `id` authority.
   *
   * @returns {String}
   */
  get uriId () {
    return `id:${this.id}`
  }

  /**
   * The URI using the `uuid` authority.
   *
   * @returns {String}
   */
  get uriUuid () {
    return `uuid:${this.uuid}`
  }

  /**
   * Extract the extension from a string.
   *
   * @param {String} string
   */
  extensionFromString (string) {
    this.extension = string.split('.').pop().toLowerCase()
  }

  /**
   * Store the file name from a HTTP URL.
   *
   * @param {String} url
   */
  filenameFromHTTPUrl (url) {
    this.filename = url.split('/').pop()
  }

  /**
   * Merge an object into the class object.
   *
   * @param {object} properties - Add an object to the class properties.
   */
  addProperties (properties) {
    for (const property in properties) {
      this[property] = properties[property]
    }
  }

  /**
   * @type {String}
   */
  get titleSafe () {
    if ('title' in this) return this.title
    if ('filename' in this) return this.filename
    if ('uri' in this) return this.uri
  }

  /**
   * True if the media file is playable, for example an audio or a video file.
   *
   * @type {Boolean}
   */
  get isPlayable () {
    return ['audio', 'video'].includes(this.type)
  }

  /**
   * True if the media file is visible, for example an image or a video file.
   *
   * @type {Boolean}
   */
  get isVisible () {
    return ['image', 'video'].includes(this.type)
  }

  /**
   * All plain text collected from the properties except some special properties.
   *
   * @type {string}
   */
  get plainText () {
    const output = []
    const excludedProperties = [
      'assetType',
      'extension',
      'filename',
      'httpUrl',
      'id',
      'mediaElement',
      'metaTypes',
      'musicbrainzRecordingId',
      'musicbrainzWorkId',
      'path',
      'previewHttpUrl',
      'previewImage',
      'samples',
      'mainImage',
      'shortcut',
      'size',
      'source',
      'timeModified',
      'type',
      'uri',
      'uriAuthority',
      'uriRaw',
      'uriScheme',
      'uuid',
      'wikidata',
      'youtube'
    ]
    for (const property in this) {
      if (this[property] && !excludedProperties.includes(property)) {
        output.push(this[property])
      }
    }
    return convertHtmlToPlainText(output.join(' | '))
  }

  /**
   * The vue router link of the component `MediaAsset.vue`.
   *
   * Examples:
   * * `#/media/localfile/013b3960-af60-4184-9d87-7c3e723550b8`
   *
   * @type {string}
   */
  get routerLink () {
    return `#/media/${this.uriScheme}/${this.uriAuthority}`
  }

  /**
   * Sort properties alphabetically aand move some important ones to the
   * begining of the array.
   *
   * @return {Array}
   */
  get propertiesSorted () {
    let properties = Object.keys(this)
    properties = properties.sort()
    function moveOnFirstPosition (properties, property) {
      properties = properties.filter(item => item !== property)
      properties.unshift(property)
      return properties
    }
    for (const property of ['id', 'uri', 'title']) {
      properties = moveOnFirstPosition(properties, property)
    }
    return properties
  }

  /**
   * Dummy method. Has to be overwritten by the subclass `MultiPartAsset()`.
   * Returns `this.httpUrl`.
   * @returns {String}
   */
  getMultiPartHttpUrlByNo () {
    return this.httpUrl
  }
}

/**
 * If a media file has a property with the name `multiPartCount` set, it is a
 * multi part asset.
 *
 *  * @property {Number} multiPartCount - The of count of parts if the media file
 *   is a multi part asset.
 */
class MultiPartAsset extends ClientMediaAsset {

  /**
   * The actual multi part asset count. If the multi part asset is restricted
   * the method returns 1, else the count of all the parts.
   *
   * @returns {Number}
   */
  get multiPartCountActual () {
    return this.multiPartCount
  }

  /**
   * Retrieve the HTTP URL of the multi part asset by the part number.
   *
   * @param {Number} The part number starts with 1.
   *
   * @returns {String}
   */
  getMultiPartHttpUrlByNo (no) {
    if (!this.multiPartCount) return this.httpUrl
    if (this.httpUrl) {
      return formatMultiPartAssetFileName(this.httpUrl, no)
    }
  }
}

/**
 * A multi part asset can be restricted in different ways. This class holds the
 * data of the restriction (for example all parts, only a single part, a
 * subset of parts). A multi part asset can be restricted to one part only by a
 * URI fragment (for example `#2`). The URI `id:Score#2` resolves always to the
 * HTTP URL `http:/example/media/Score_no02.png`.
 */
class MultiPartSelection {
  /**
   * @param {module:@bldr/vue-app-media~MultiPartAsset} multiPartAsset
   * @param {String} selectionSpec - Can be a uri, everthing after `#`, for
   * example `id:Song-2#2-5` -> `2-5`
   */
  constructor (multiPartAsset, selectionSpec) {
    if (selectionSpec.indexOf('#') === -1 || !selectionSpec) {
      selectionSpec = ''
    } else if (typeof selectionSpec === 'string') {
      selectionSpec = selectionSpec.replace(/^.*#/, '')
    }

    /**
     * @type {String}
     */
    this.selectionSpec = selectionSpec

    /**
     * @type {module:@bldr/vue-app-media~MultiPartAsset}
     */
    this.asset = multiPartAsset

    /**
     * The URI of the media asset suffixed with the selection specification.
     * `id:Beethoven-9th#2,3,4,6-8`. A URI without a selection specification
     * means all parts.
     *
     * @type {String}
     */
    let uri
    if (!this.selectionSpec) {
      uri = this.asset.uri
    } else {
      uri = `${this.asset.uri}#${selectionSpec}`
    }
    this.uri = uri

    /**
     * @type {Array}
     */
    this.partNos = selectSubset(selectionSpec,
      { elementsCount: this.asset.multiPartCount, firstElementNo: 1 }
    )
  }

  /**
   * The URI using the `id` authority.
   *
   * @returns {String}
   */
  get uriId () {
    if (!this.selectionSpec) {
      return this.asset.uriId
    } else {
      return `${this.asset.uriId}#${this.selectionSpec}`
    }
  }

  /**
   * The URI using the `uuid` authority.
   *
   * @returns {String}
   */
  get uriUuid () {
    if (!this.selectionSpec) {
      return this.asset.uriUuid
    } else {
      return `${this.asset.uriUuid}#${this.selectionSpec}`
    }
  }

  /**
   * @returns {Number}
   */
  get partCount () {
    return this.partNos.length
  }

  /**
   * Used for the preview to fake the this class is a normal asset.
   */
  get httpUrl () {
    return this.getMultiPartHttpUrlByNo(1)
  }

  /**
   * Retrieve the HTTP URL of the multi part asset by the part number.
   *
   * @param {Number} The part number starts with 1. We set a default value,
   * because no is sometimes undefined when only one part is selected. The
   * router then creates no step url (not /slide/1/step/1) but (/slide/1)
   *
   * @returns {String}
   */
  getMultiPartHttpUrlByNo (no = 1) {
    return this.asset.getMultiPartHttpUrlByNo(this.partNos[no - 1])
  }
}

/**
 * @param {ClientMediaAsset} asset
 */
function createMediaElement (asset) {
  /**
   * Create a video element like `new Audio() does.`
   *
   * @param {String} src
   */
  function Video (src) {
    const video = document.createElement('video')
    video.src = src
    return video
  }

  let mediaElement
  if (!('type' in asset)) throw new Error(`asset “${asset}” has no type.`)

  switch (asset.type) {
    case 'audio':
      mediaElement = new Audio(asset.httpUrl)
      break

    case 'video':
      mediaElement = new Video(asset.httpUrl)
      mediaElement.controls = true
      if (asset.previewHttpUrl) {
        mediaElement.poster = asset.previewHttpUrl
      }
      break

    case 'image':
      mediaElement = new Image()
      mediaElement.src = asset.httpUrl
      break

    default:
      throw new Error(`Not supported asset type “${asset.type}”.`)
  }
  return mediaElement
}

/**
 * Resolve (get the HTTP URL and some meta informations) of a remote media
 * file by its URI. Resolve a local file. The local files have to dropped
 * in the application. Create media elements for each media file. Create samples
 * for playable media files.
 */
class Resolver {
  constructor () {
    /**
     * Assets with linked assets have to be cached. For example: many
     * audio assets can have the same cover ID.
     *
     * @type {Object}
     * @private
     */
    this.cache_ = {}

    /**
     * Store for linked URIs (URIs inside media assets). They are collected
     * and resolved in a second step after the resolution of the main
     * media assets.
     *
     * @type {Array}
     */
    this.linkedUris = []
  }

  /**
   * @private
   * @param {string} field - For example `id` or `uuid`
   * @param {string|json} search - For example `Fuer-Elise_HB`
   * @param {Boolean} throwException - Throw an exception if the media URI
   *  cannot be resolved (default: `true`).
   *
   * @returns {Object} - See {@link https://github.com/axios/axios#response-schema}
   */
  async queryMediaServer_ (field, search, throwException = true) {
    // Do search for samples.
    search = search.replace(/#.*$/g, '')
    const cacheKey = `${field}:${search}`
    if (this.cache_[cacheKey]) return this.cache_[cacheKey]
    const response = await httpRequest.request({
      url: 'query',
      method: 'get',
      params: {
        type: 'assets',
        method: 'exactMatch',
        field: field,
        search: search
      }
    })
    if (response && response.status === 200 && response.data && response.data.path) {
      this.cache_[cacheKey] = response
      return response
    }
    if (throwException) throw new Error(`Media with the ${field} ”${search}” couldn’t be resolved.`)
  }

  /**
   * @private
   * @param {module:@bldr/media-client.ClientMediaAsset} asset - The
   *   `asset` object, a client side representation of a media asset.
   * @property {String} httpUrl
   * @property {String} path
   * @param {Boolean} throwException - Throw an exception if the media URI
   *  cannot be resolved (default: `true`).
   *
   * @returns {String} - A HTTP URL.
   */
  resolveHttpUrl_ (asset, throwException) {
    if (asset.httpUrl) return asset.httpUrl
    if (asset.path) {
      return `${httpRequest.baseUrl}/media/${asset.path}`
    }
    if (throwException) throw new Error(`Can not resolve HTTP URL. The asset object needs the property “path” or “httpUrl”.`)
  }

  /**
   * Create samples for each playable media file. By default each media file
   * has one sample called “complete”.
   *
   * @param {module:@bldr/media-client.ClientMediaAsset} asset - The
   *   `asset` object, a client side representation of a media asset.
   *
   * @returns {module:@bldr/media-client~Sample[]}
   */
  createSamples_ (asset) {
    if (asset.isPlayable) {
      // First sample of each playable media file is the “complete” track.
      const completeSampleSpec = {
        title: 'komplett',
        id: 'complete',
        startTime: 0
      }
      for (const prop of ['startTime', 'duration', 'endTime', 'fadeOut', 'fadeIn', 'shortcut']) {
        if (asset[prop]) {
          completeSampleSpec[prop] = asset[prop]
          delete asset[prop]
        }
      }

      // Store all sample specs in a object to check if there is already a
      // sample with the id “complete”.
      let sampleSpecs = null
      if (asset.samples) {
        sampleSpecs = {}
        for (const sampleSpec of asset.samples) {
          sampleSpecs[sampleSpec.id] = sampleSpec
        }
      }

      // Create the sample “complete”.
      let sample
      const samples = {}
      if (!sampleSpecs || (sampleSpecs && !('complete' in sampleSpecs))) {
        sample = new Sample(asset, completeSampleSpec)
        samples[sample.uri] = sample
      }

      // Add further samples specifed in the yaml section.
      if (sampleSpecs) {
        for (const sampleId in sampleSpecs) {
          const sampleSpec = sampleSpecs[sampleId]
          sample = new Sample(asset, sampleSpec)
          samples[sample.uri] = sample
        }
      }

      for (const sampleUri in samples) {
        samples[sampleUri].mediaElement = createMediaElement(asset)
        store.commit('media/addSample', samples[sampleUri])
      }
      return samples
    }
  }

  /**
   * @private
   *
   * @param {String} uri - For example `uuid:... id:...`
   * @param {Object} data - Object from the REST API.
   *
   * @returns {module:@bldr/media-client.ClientMediaAsset}
   */
  createAssetFromRestData_ (uri, data) {
    let asset
    if (data.multiPartCount) {
      asset = new MultiPartAsset({ uri })
      store.commit('media/addMultiPartUri', asset.uriRaw)
    } else {
      asset = new ClientMediaAsset({ uri })
    }
    extractMediaUrisRecursive(data, this.linkedUris)
    asset.addProperties(data)
    asset.httpUrl = this.resolveHttpUrl_(asset)
    if (asset.previewImage) {
      asset.previewHttpUrl = `${asset.httpUrl}_preview.jpg`
    }
    return asset
  }

  /**
   * @private
   *
   * @param {Object} file - A file object, see
   *  {@link https://developer.mozilla.org/de/docs/Web/API/File}
   *
   * @returns {module:@bldr/media-client.ClientMediaAsset}
   */
  createAssetFromFileObject_ (file) {
    if (mediaCategoriesManager.isAsset(file.name)) {
      // blob:http:/localhost:8080/8c00d9e3-6ff1-4982-a624-55f125b5c0c0
      const httpUrl = URL.createObjectURL(file)
      // 8c00d9e3-6ff1-4982-a624-55f125b5c0c0
      const uuid = httpUrl.substr(httpUrl.length - 36)
      // We use the uuid instead of the file name. The file name can contain
      // whitespaces and special characters. A uuid is  more reliable.
      const uri = `localfile:${uuid}`
      return new ClientMediaAsset({
        uri: uri,
        httpUrl: httpUrl,
        filename: file.name
      })
    }
  }

  /**
   * @param {module:@bldr/media-client.ClientMediaAsset} asset
   */
  addMediaElementToAsset (asset) {
    asset.type = mediaCategoriesManager.extensionToType(asset.extension)
    // After type
    if (asset.type !== 'document') {
      asset.mediaElement = createMediaElement(asset)
    }
    const samples = this.createSamples_(asset)
    if (samples) {
      asset.samples = samples
    }
  }

  /**
   * # Remote
   *
   * Resolve (get the HTTP URL and some meta informations) of a remote media
   * file by its URI.
   *
   * Order of async resolution calls / tasks:
   *
   * 1. asset
   * 2. httpUrl
   * 3. mediaElement
   *
   * # Local
   *
   * Resolve a local file. The local files have to dropped in in the
   * application.
   *
   * Order of async resolution calls / tasks:
   *
   * 1. mediaElement
   *
   * @private
   * @param {module:@bldr/media-client~assetSpec} assetSpec - URI
   *   or File object
   * @param {Boolean} throwException - Throw an exception if the media URI
   *  cannot be resolved (default: `true`).
   *
   * @returns {module:@bldr/media-client.ClientMediaAsset}
   */
  async resolveSingle_ (assetSpec, throwException) {
    let asset
    // Remote uri to resolve
    if (typeof assetSpec === 'string') {
      const storedAsset = store.getters['media/assetByUri'](assetSpec)
      if (storedAsset) {
        return storedAsset
      }
      if (assetSpec.match(mediaUriRegExp)) {
        const uri = assetSpec.split(':')
        const response = await this.queryMediaServer_(uri[0], uri[1], throwException)
        if (response) asset = this.createAssetFromRestData_(assetSpec, response.data)
      } else if (throwException) {
        throw new Error(`Unkown media asset URI: “${assetSpec}”: Supported URI schemes: http,https,id,uuid`)
      }
    // Local: File object from drag and drop or open dialog
    } else if (assetSpec instanceof File) {
      asset = this.createAssetFromFileObject_(assetSpec)
    }
    if (asset) {
      this.addMediaElementToAsset(asset)
      store.dispatch('media/addAsset', asset)
      return asset
    }
  }

  /**
   * Resolve one or more remote media files by URIs, HTTP URLs or
   * local media files by their file objects.
   *
   * Linked media URIs are resolve in a second step (not recursive). Linked
   * media assets are not allowed to have linked media URIs.
   *
   * @param {module:@bldr/media-client~assetSpecs} assetSpecs
   * @param {Boolean} throwException - Throw an exception if the media URI
   *  cannot be resolved (default: `true`).
   *
   * @returns {module:@bldr/media-client.ClientMediaAsset[]}
   */
  async resolve (assetSpecs, throwException = true) {
    if (typeof assetSpecs === 'string' || assetSpecs instanceof File) {
      assetSpecs = [assetSpecs]
    }

    const uniqueSpecs = removeDuplicatesFromArray(assetSpecs)

    // Resolve the main media URIs
    let promises = []
    for (const assetSpec of uniqueSpecs) {
      promises.push(this.resolveSingle_(assetSpec, throwException))
    }
    const mainAssets = await Promise.all(promises)
    let linkedAssets = []
    // @todo make this recursive: For example master person -> main image
    // famous pieces -> audio -> cover
    // Resolve the linked media URIs.
    if (this.linkedUris.length) {
      promises = []
      for (const mediaUri of this.linkedUris) {
        promises.push(this.resolveSingle_(mediaUri, throwException))
      }
      linkedAssets = await Promise.all(promises)
    }
    const assets = mainAssets.concat(linkedAssets)
    if (assets) return assets
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
     *  @type {module:@bldr/media-client~Resolver}
     */
    this.resolver = new Resolver()

    /**
     *  @type {module:@bldr/http-request.HttpRequest}
     */
    this.httpRequest = httpRequest

    /**
     * @type {module:@bldr/media-client~Canvas}
     */
    this.canvas = new Canvas()

    if (router) {
      const style = {
        darkMode: false
      }
      const routes = [
        {
          path: '/media',
          name: 'media-overview',
          meta: {
            shortcut: 'm',
            title: 'Media',
            style
          },
          component: ComponentMediaOverview
        },
        {
          path: '/media/:uriScheme/:uriAuthority',
          name: 'asset',
          meta: {
            title: 'Media file',
            style
          },
          component: ComponentClientMediaAsset
        }
      ]
      router.addRoutes(routes)
      shortcuts.fromRoute(routes[0])
    }
  }

  /**
   * Gets called in src/lamp/src/content-file.js
   * Causes problems with multipart selections
   *
   * @param {String} parentDir
   */
  async resolveByParentDir (parentDir) {
    const response = await httpRequest.request({
      url: 'query',
      method: 'get',
      params: {
        type: 'assets',
        method: 'substringSearch',
        field: 'path',
        search: parentDir
      }
    })

    for (const data of response.data) {
      const asset = this.resolver.createAssetFromRestData_(`id:${data.id}`, data)
      this.resolver.addMediaElementToAsset(asset)
      store.dispatch('media/addAsset', asset)
    }
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
    const output = {}
    const assets = await this.resolver.resolve(assetSpecs, throwException)
    if (assets) {
      for (const asset of assets) {
        if (asset) output[asset.uri] = asset
      }
      for (const uri of store.getters['media/multiPartUris']) {
        const asset = store.getters['media/assetByUri'](uri)
        const multiPartSelection = new MultiPartSelection(asset, uri)
        store.commit('media/addMultiPartSelection', multiPartSelection)
      }
      this.addShortcutForAssets_()
      this.setPreviewImagesFromCoverProp_()
      this.addShortcutForSamples_()
    }
    return output
  }

  /**
   * Audio or video files with a property `cover` set get the HTTP URL of this
   * cover image as a preview image. The URIs are automatically resolved when
   * creating the ClientMediaAsset objects.
   *
   * @private
   */
  setPreviewImagesFromCoverProp_ () {
    const assets = store.getters['media/assets']
    for (const uri in assets) {
      const asset = assets[uri]
      if (asset.isPlayable && asset.cover) {
        const cover = store.getters['media/assetByUri'](asset.cover)
        if (!cover) {
          throw new Error(`Unable to resolve the preview cover: ${asset.cover}`)
        }
        asset.previewHttpUrl = cover.httpUrl
      }
    }
  }

  /**
   * Add shortcuts for media files. At the momenten only for images. Video
   * and audio are samples and handled separately.
   *
   * @private
   */
  addShortcutForAssets_ () {
    const assets = store.getters['media/assets']
    let shortcutNo = 1
    for (const uri in assets) {
      // i 10 does not work.
      if (shortcutNo > 9) return
      const asset = assets[uri]
      if (!asset.shortcut && asset.type === 'image') {
        asset.shortcut = `i ${shortcutNo}`
        shortcuts.add(
          asset.shortcut,
          () => {
            this.canvas.hide()
            this.player.stop()
            this.canvas.show(asset.mediaElement)
          },
          // Play
          `Zeige Bild „${asset.titleSafe}“`
        )
        shortcutNo += 1
      }
    }
  }

  /**
   * Add shortcut for each sample. Audio samples are triggered by “a number” and
   * video files are trigger by “v number”.
   *
   * @private
   */
  addShortcutForSamples_ () {
    // We have to loop through all samples to get the latest shortcut number.
    const samples = store.getters['media/samples']
    const firstTriggerKeyByType = (type) => {
      if (type === 'audio') {
        return 'a'
      } else if (type === 'video') {
        return 'v'
      }
    }

    const addShortcutsByType = (samples, type) => {
      let counter = store.getters['media/shortcutCounterByType'](type)
      // a 10 does not work.
      if (counter > 9) return
      for (const sampleUri in samples) {
        const sample = samples[sampleUri]
        if (!sample.shortcutCustom && !sample.shortcut && sample.asset.type === type) {
          counter = store.getters['media/shortcutCounterByType'](type)
          // a 10 does not work.
          if (counter > 9) return
          sample.shortcutNo = counter
          store.dispatch('media/incrementShortcutCounterByType', type)
          sample.shortcut = `${firstTriggerKeyByType(sample.asset.type)} ${sample.shortcutNo}`
          shortcuts.add(
            sample.shortcut,
            () => {
              // TODO: Start the same video twice behaves very strange.
              this.canvas.hide()
              this.player.load(sample.uri)
              this.player.start()
              if (sample.asset.isVisible) {
                this.canvas.show(sample.mediaElement)
              }
            },
            // Play
            `Spiele Ausschnitt „${sample.titleSafe}“`
          )
        }
      }
    }

    const addShortcutsCustom = (samples) => {
      for (const sampleUri in samples) {
        const sample = samples[sampleUri]
        if (sample.shortcutCustom && !sample.shortcut) {
          sample.shortcut = sample.shortcutCustom
          shortcuts.add(
            sample.shortcut,
            () => {
              this.player.load(sample.uri)
              this.player.start()
            },
            // Play
            `Spiele Ausschnitt „${sample.titleSafe}“`
          )
        }
      }
    }
    addShortcutsCustom(samples)
    for (const assetType of ['audio', 'video']) {
      addShortcutsByType(samples, assetType)
    }
  }
}

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

    Vue.use(DynamicSelect)

    Vue.filter('duration', formatDuration)
    /**
     * $media
     * @memberof module:@bldr/lamp~Vue
     * @type {module:@bldr/media-client~Media}
     */
    Vue.prototype.$media = new Media()
    Vue.component('media-player', ComponentMediaPlayer)
    Vue.component('horizontal-play-buttons', ComponentHorizontalPlayButtons)
    Vue.component('play-button', ComponentPlayButton)
    Vue.component('media-canvas', ComponentMediaCanvas)
  }
}

export default Plugin
