/**
 * Resolve media files. Counter part of the BALDR media server.
 *
 * @module @bldr/vue-plugin-media
 */

/* globals config document Audio Image File */

import { getDefaultServers, HttpRequest, getDefaultRestEndpoints, HttpRequestNg } from '@bldr/http-request'
import { formatMultiPartAssetFileName, AssetTypes } from '@bldr/core-browser'

import Vue from 'vue'
import DynamicSelect from '@bldr/vue-plugin-dynamic-select'

// Vue components
import ComponentMediaFile from './MediaFile.vue'
import ComponentMediaOverview from './MediaOverview/index.vue'
// import ComponentMediaPlayer from './MediaPlayer.vue'
import ComponentHorizontalPlayButtons from './HorizontalPlayButtons.vue'
import ComponentMediaCanvas from './MediaCanvas.vue'
import ComponentPlayButton from './PlayButton.vue'

const restEndpoints = getDefaultRestEndpoints()
export const httpRequestNg = new HttpRequestNg(restEndpoints, '/api/media')
export const httpRequest = new HttpRequest(getDefaultServers(), '/api/media')

/**
 * We fade in very short and smoothly to avoid audio artefacts.
 *
 * @type {Number}
 */
const defaultFadeInSec = 0.3

/**
 * We never stop. Instead we fade out very short and smoothly.
 *
 * @type {Number}
 */
const defaultFadeOutSec = 1

/**
 * Number of milliseconds to wait before the media file is played.
 *
 * @type {Number}
 */
const defaultPlayDelayMsec = 10

/**
 * An instance of the vuex store.
 */
export let store

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
    if (uri && typeof uri === 'string' && uri.match(/^(id|filename):[a-zA-Z0-9_-]+$/)) {
      return true
    }
    return false
  }

  /**
   * @param {Mixed} value - A mixed type value to test if it is a media URI.
   * @param {Array} urisStore - Target array to store the media URIs.
   */
  function collectMediaUri(value, urisStore) {
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
  if (!duration) return '00:00'
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
  /**
   * @param {object} store - The {@link https://vuex.vuejs.org/ vuex} store
   * instance.
   */
  constructor (store) {
    /**
     * The {@link https://vuex.vuejs.org/ vuex} store instance.
     *
     * @type {Object}
     */
    this.$store = store

    /**
     * Global volume: from 0 - 1
     *
     * @type {Number}
     */
    this.globalVolume = 1

    /**
     * @type {module:@bldr/vue-plugin-media~CustomEvents}
     */
    this.events = new CustomEvents()
  }

  get samplePlaying () {
    return this.$store.getters['media/samplePlaying']
  }

  set samplePlaying (sample) {
    this.$store.dispatch('media/setSamplePlaying', sample)
  }

  get sampleLoaded () {
    return this.$store.getters['media/sampleLoaded']
  }

  set sampleLoaded (sample) {
    this.$store.commit('media/setSampleLoaded', sample)
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
      sample = this.$store.getters['media/sampleByUri'](uri)
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
   * @param {module:@bldr/vue-plugin-media~Player} player
   */
  constructor (store, player) {
    /**
     * The {@link https://vuex.vuejs.org/ vuex} store instance.
     * @type {Object}
     */
    this.$store = store

    /**
     * @type {module:@bldr/vue-plugin-media~Player}
     */
    this.player = player
  }

  /**
   * @private
   */
  start_ () {
    const sample = this.$store.getters['media/samplePlayListCurrent']
    this.player.load(sample)
    this.player.start()
  }

  /**
   * Start the previous sample in the playlist.
   */
  startPrevious () {
    this.$store.dispatch('media/setPlayListSamplePrevious')
    this.start_()
  }

  /**
   * Start the next sample in the playlist.
   */
  startNext () {
    this.$store.dispatch('media/setPlayListSampleNext')
    this.start_()
  }
}

const state = {
  mediaFiles: {},
  playList: [],
  playListNoCurrent: null,
  assetTypes: {
    audio: {},
    video: {},
    image: {}
  },
  restApiServers: [],
  samples: {},
  // To realize a playthrough and stop option on the audio and video master
  // slides, we must track the currently playing sample and the in the future
  // to be played sample (loaded).
  sampleLoaded: null,
  samplePlaying: null
}

const getters = {
  samplePlayListCurrent: (state, getters) => {
    return getters.samples[getters.playList[getters.playListNoCurrent - 1]]
  },
  httpUrlByUri: (state, getters) => uri => {
    const media = getters.mediaFiles
    if (uri in media) {
      return media[uri].httpUrl
    }
    return null
  },
  isMedia: (state, getters) => {
    return Object.keys(getters.mediaFiles).length > 0
  },
  mediaFileByUri: (state, getters) => uri => {
    // mediaFile URI is specifed as a sample
    if (uri.indexOf('#') > -1) uri = uri.replace(/#.*$/, '')
    const media = getters.mediaFiles
    if (uri in media) {
      return media[uri]
    }
    return null
  },
  mediaFiles: state => {
    return state.mediaFiles
  },
  mediaFilesByType: state => type => {
    return state.assetTypes[type]
  },
  playList: state => {
    return state.playList
  },
  playListNoCurrent: state => {
    return state.playListNoCurrent
  },
  restApiServers: state => {
    return state.restApiServers
  },
  sampleLoaded: state => {
    return state.sampleLoaded
  },
  samples: state => {
    return state.samples
  },
  samplePlaying: state => {
    return state.samplePlaying
  },
  sampleByUri: (state, getters) => uri => {
    if (!uri) return
    const samples = getters.samples
    if (uri.indexOf('#') === -1) uri = `${uri}#complete`
    if (uri in samples) {
      return samples[uri]
    }
  },
  typeCount: state => type => {
    return Object.keys(state.assetTypes[type]).length
  }
}

const actions = {
  addMediaFile ({ commit, dispatch }, mediaFile) {
    commit('addMediaFile', mediaFile)
    commit('addMediaFileToTypes', mediaFile)
    for (const sampleUri in mediaFile.samples) {
      dispatch('addSampleToPlayList', mediaFile.samples[sampleUri])
    }
  },
  addSampleToPlayList ({ commit, getters }, sample) {
    const list = getters.playList
    if (!list.includes(sample.uri) && sample.mediaFile.type !== 'image') {
      commit('addSampleToPlayList', sample)
    }
  },
  clear ({ dispatch, commit }) {
    dispatch('removeMediaFilesAll')
    commit('setSampleLoaded', null)
    commit('setSamplePlaying', null)
    commit('setPlayListNoCurrent', null)
  },
  removeMediaFile ({ commit, getters }, mediaFile) {
    for (const sampleUri in mediaFile.samples) {
      const sample = mediaFile.samples[sampleUri]
      commit('removeSample', sample)
      commit('removeSampleFromPlayList', sample)
    }
    commit('removeMediaFileFromTypes', mediaFile)
    commit('removeMediaFile', mediaFile)
  },
  removeMediaFilesAll ({ dispatch, getters }) {
    for (const mediaFileUri in getters.mediaFiles) {
      dispatch('removeMediaFile', getters.mediaFiles[mediaFileUri])
    }
  },
  setPlayListSampleCurrent ({ commit, getters }, sample) {
    let no = null
    if (sample) {
      no = getters.playList.indexOf(sample.uri) + 1
    }
    commit('setPlayListNoCurrent', no)
  },
  setPlayListSampleNext ({ commit, getters }) {
    const no = getters.playListNoCurrent
    const count = getters.playList.length
    if (no === count) {
      commit('setPlayListNoCurrent', 1)
    } else {
      commit('setPlayListNoCurrent', no + 1)
    }
  },
  setPlayListSamplePrevious ({ commit, getters }) {
    const no = getters.playListNoCurrent
    const count = getters.playList.length
    if (no === 1) {
      commit('setPlayListNoCurrent', count)
    } else {
      commit('setPlayListNoCurrent', no - 1)
    }
  },
  async setRestApiServers ({ commit }) {
    const servers = await httpRequestNg.restEndpoints.getReachable()
    const versions = await httpRequestNg.request('version', 'all')
    const counts = await httpRequestNg.request('stats/count', 'all')
    const updates = await httpRequestNg.request('stats/updates', 'all')

    const result = []
    for (const endpointName in servers) {
      result.push({
        name: servers[endpointName].name,
        baseUrl: servers[endpointName].baseUrl,
        version: versions[endpointName].data.version,
        count: counts[endpointName].data,
        update: updates[endpointName].data[0].begin,
        commitId: updates[endpointName].data[0].lastCommitId
      })
    }
    commit('setRestApiServers', result)
  },
  setSamplePlaying ({ commit, dispatch }, sample) {
    commit('setSamplePlaying', sample)
    if (sample) dispatch('setPlayListSampleCurrent', sample)
  }
}

const mutations = {
  addMediaFile (state, mediaFile) {
    Vue.set(state.mediaFiles, mediaFile.uri, mediaFile)
  },
  addMediaFileToTypes (state, mediaFile) {
    Vue.set(state.assetTypes[mediaFile.type], mediaFile.uri, mediaFile)
  },
  addSample (state, sample) {
    Vue.set(state.samples, sample.uri, sample)
  },
  addSampleToPlayList (state, sample) {
    state.playList.push(sample.uri)
  },
  removeMediaFile (state, mediaFile) {
    Vue.delete(state.mediaFiles, mediaFile.uri)
  },
  removeMediaFileFromTypes (state, mediaFile) {
    Vue.delete(state.assetTypes[mediaFile.type], mediaFile.uri)
  },
  removeSample (state, sample) {
    Vue.delete(state.samples, sample.uri)
  },
  removeSampleFromPlayList (state, sample) {
    while (state.playList.indexOf(sample.uri) > -1) {
      const index = state.playList.indexOf(sample.uri)
      if (index > -1) {
        state.playList.splice(index, 1)
      }
    }
  },
  setPlayListNoCurrent (state, no) {
    state.playListNoCurrent = no
  },
  setRestApiServers (state, restApiServers) {
    Vue.set(state, 'restApiServers', restApiServers)
  },
  setSampleLoaded (state, sample) {
    state.sampleLoaded = sample
  },
  setSamplePlaying (state, sample) {
    state.samplePlaying = sample
  }
}

const storeModule = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}

export const assetTypes = new AssetTypes(config)

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
   * @param {MediaFile} mediaFile
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
  constructor (mediaFile, { title, id, startTime, fadeIn, duration, fadeOut, endTime, shortcut }) {
    /**
     * The parent media file object.
     *
     * @type {module:@bldr/vue-plugin-media.MediaFile}
     */
    this.mediaFile = mediaFile

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
     * example `uri#id`: `id:Beethoven#complete` or
     * `filename:beethoven.jpg#Theme_1`.
     *
     * @type {String}
     */
    this.id = id

    /**
     * The URI of the sample in the format `uri#id`: for example
     * `id:Beethoven#complete`,
     * `filename:beethoven.jpg#Theme_1`.
     *
     * @type {String}
     */
    this.uri = `${this.mediaFile.uri}#${id}`

    /**
     * The start time in seconds. The sample is played from this start time
     * using the `mediaElement` of the `mediaFile`. It is the “zero” second
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
     * @type {module:@bldr/vue-plugin-media~Interval}
     * @private
     */
    this.interval_ = new Interval()

    /**
     * @type {module:@bldr/vue-plugin-media~TimeOut}
     * @private
     */
    this.timeOut_ = new TimeOut()

    /**
     * @type {module:@bldr/vue-plugin-media~CustomEvents}
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
   * If the sample is the complete media file get the title of the media file.
   * For example `Glocken (Das große Tor von Kiew)`
   *
   * @type {String}
   */
  get titleFormated () {
    if (this.id === 'complete') {
      return this.mediaFile.titleSafe
    } else {
      return `${this.title} (${this.mediaFile.titleSafe})`
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
    return Number(timeIntervaleString)
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
      return defaultFadeInSec
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
      return defaultFadeOutSec
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
    if (this.mediaFile.assetType === 'video') {
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
  fadeIn (targetVolume = 1, duration = defaultFadeInSec) {
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
    }, defaultPlayDelayMsec)
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
  fadeOut (duration = defaultFadeOutSec) {
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
    if (this.mediaFile.assetType === 'video') {
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
    if (this.mediaFile.assetType === 'video') {
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
 * input specifications
 */
class WrappedSample {
  /**
   * @param {Object|String} spec - Different input specifications are
   *   possible:
   *
   *   1. The sample URI as a string (for example: `Fuer-Elise_HB`).
   *   2. An object with the mandatory property `uri` (for example:
   *      `{ uri: 'Fuer-Elise_HB'}`).
   *   3. An instance of the class `Sample`.
   */
  constructor (spec) {

    /**
     * @type {module:@bldr/vue-plugin-media~Sample}
     * @private
     */
    this.sample_ = null

    /**
     * @type {String}
     */
    this.uri = null
    if (typeof spec === 'string') {
      this.uri = spec
    } else if (spec.uri && !spec.sample) {
      this.uri = spec.uri
    } else if (spec.constructor.name === 'Sample') {
      this.uri = spec.uri
      this.sample_ = spec
    }

    /**
     * True if the title is set manually.
     *
     * This specification sets the property to `true`.
     * `{ title: 'My Title', uri: 'id:Fuer-Elise' }`
     *
     * @type {Boolean}
     */
    this.isTitleSet = false

    /**
     * The manually set title.
     *
     * @type {String}
     * @private
     */
    this.title_ = null
    if (spec.title) {
      this.isTitleSet = true
      this.title_ = spec.title
    }
  }

  /**
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
   * We have to use a getter, because the sample may not be resolved at
   * the constructor time.
   *
   * @returns {module:@bldr/vue-plugin-media~Sample}
   */
  get sample () {
    if (this.sample_) return this.sample_
    return store.getters['media/sampleByUri'](this.uri)
  }
}

/**
 * Wrap some samples with metadata. Allow fuzzy specification of the samples.
 * Normalize the input.
 */
export class WrappedSamples {
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
      specArray= [spec]
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
    this.isTitleSet = false
    if (this.samples[0].isTitleSet) {
      this.isTitleSet = true
    }
  }

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
 *   `filename:Haydn_Joseph.jpg` or `http://example.com/Haydn_Joseph.jpg`.
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
 */
export class MediaFile {
  /**
   * @param {object} mediaData - Mandatory properties are: `uri`
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
     * A multi part media asset can be restricted to only one element by
     * a fragment in the URI (for example `id:Score#2`).
     *
     * @type {String}
     * @private
     */
    this.restrictedTo = null
    if (this.uriRaw.indexOf('#') > -1) {
      let segments = this.uriRaw.split('#')
      this.restrictedTo = parseInt(segments[1])
    }

    /**
     * Uniform Resource Identifier, for example  `id:Haydn`,
     * `filename:Haydn_Joseph.jpg` or `http://example.com/Haydn_Joseph.jpg`.
     * The sample addition (`#complete`) is removed.
     * @type {string}
     */
    this.uri = decodeURI(this.uri.replace(/#.*$/, ''))
    let segments = this.uri.split(':')

    /**
     * for example: `http`, `https`, `blob`
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
      this.type = assetTypes.extensionToType(this.extension)
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
   * The actual multi part asset count. If the multi part asset is restricted
   * the method returns 1, else the count of all the parts.
   *
   * @returns {Number}
   */
  get multiPartCountActual () {
    if (this.restrictedTo || !this.multiPartCount) return 1
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
      if (this.restrictedTo) {
        no = this.restrictedTo
      }
      return formatMultiPartAssetFileName(this.httpUrl, no)
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
      'extension',
      'filename',
      'httpUrl',
      'id',
      'mediaElement',
      'path',
      'previewHttpUrl',
      'previewImage',
      'samples',
      'shortcut',
      'size',
      'timeModified',
      'type',
      'uri',
      'uriAuthority',
      'uriScheme'
    ]
    for (const property in this) {
      if (property in this && this[property] && !excludedProperties.includes(property)) {
        output.push(this[property])
      }
    }
    return output.join(' | ')
  }

  /**
   * The vue router link of the component `MediaFile.vue`.
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
}

/**
 * @param {MediaFile} mediaFile
 */
async function createMediaElement (mediaFile) {
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
  if (!('type' in mediaFile)) throw new Error(`mediaFile “${mediaFile}” has no type.`)

  switch (mediaFile.type) {
    case 'audio':
      mediaElement = new Audio(mediaFile.httpUrl)
      break

    case 'video':
      mediaElement = new Video(mediaFile.httpUrl)
      mediaElement.controls = true
      if (mediaFile.previewHttpUrl) {
        mediaElement.poster = mediaFile.previewHttpUrl
      }
      break

    case 'image':
      mediaElement = new Image()
      mediaElement.src = mediaFile.httpUrl
      break

    default:
      throw new Error(`Not supported mediaFile type “${mediaFile.type}”.`)
  }

  return new Promise((resolve, reject) => {
    if (mediaFile.isPlayable) {
      mediaElement.onloadedmetadata = () => {
        resolve(mediaElement)
      }
    } else {
      mediaElement.onload = () => {
        resolve(mediaElement)
      }
    }

    mediaElement.onerror = (error) => {
      console.log(error)
      reject(Error(`Could not create the MediaElement for the MediaFile with the ID “${mediaFile.id}”.`))
    }
  })
}

/**
 * A `mediaFileSpec` can be:
 *
 * 1. A remote URI (Uniform Resource Identifier) as a string, for example
 *    `id:Joseph_haydn` or `filename:beethoven.jpg` which has to be resolved.
 * 2. A already resolved HTTP URL, for example
 *    `https://example.com/Josef_Haydn.jg`
 * 3. A file object {@link https://developer.mozilla.org/de/docs/Web/API/File}
 *
 * @typedef mediaFileSpec
 * @type {(String|File)}
 */

/**
 * An array of `mediaFileSpec` or a single `mediaFileSpec`
 *
 * @typedef mediaFileSpecs
 * @type {(mediaFileSpec[]|mediaFileSpec)}
 */

/**
 * Resolve (get the HTTP URL and some meta informations) of a remote media
 * file by its URI. Resolve a local file. The local files have to dropped
 * in the application. Create media elements for each media file. Create samples
 * for playable media files.
 */
class Resolver {

  constructor () {
    /**
     * Asset with linked assets have to be cached. For example many
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
   * @param {string} field - For example `id` or `filename`
   * @param {string|json} search - For example `Fuer-Elise_HB`
   *
   * @private
   */
  async queryMediaServer_ (field, search) {
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
    if (response && response.data  && response.data.path) {
      this.cache_[cacheKey] = response
      return response
    }
    throw new Error(`Media with the ${field} ”${search}” couldn’t be resolved.`)
  }

  /**
   * @private
   * @param {module:@bldr/vue-plugin-media.MediaFile} mediaFile - The
   *   `mediaFile` object, a client side representation of a media asset.
   *
   * @returns {String} - A HTTP URL.
   */
  async resolveHttpUrl_ (mediaFile) {
    if (mediaFile.httpUrl) return mediaFile.httpUrl
    if (mediaFile.path) {
      const baseURL = await httpRequest.getFirstBaseUrl()
      return `${baseURL}/media/${mediaFile.path}`
    }
    throw new Error(`Can not generate HTTP URL.`)
  }

  /**
   * Create samples for each playable media file. By default each media file
   * has one sample called “complete”.
   *
   * @param {module:@bldr/vue-plugin-media.MediaFile} mediaFile - The
   *   `mediaFile` object, a client side representation of a media asset.
   *
   * @returns {module:@bldr/vue-plugin-media~Sample[]}
   */
  async createSamples_ (mediaFile) {
    if (mediaFile.isPlayable) {
      // First sample of each playable media file is the “complete” track.
      const completeSampleSpec = {
        title: 'komplett',
        id: 'complete',
        startTime: 0
      }
      for (const prop of ['startTime', 'duration', 'endTime', 'fadeOut', 'fadeIn', 'shortcut']) {
        if (mediaFile[prop]) {
          completeSampleSpec[prop] = mediaFile[prop]
          delete mediaFile[prop]
        }
      }

      // Store all sample specs in a object to check if there is already a
      // sample with the id “complete”.
      let sampleSpecs = null
      if (mediaFile.samples) {
        sampleSpecs = {}
        for (const sampleSpec of mediaFile.samples) {
          sampleSpecs[sampleSpec.id] = sampleSpec
        }
      }

      // Create the sample “complete”.
      let sample
      const samples = {}
      if (!sampleSpecs || (sampleSpecs && !('complete' in sampleSpecs))) {
        sample = new Sample(mediaFile, completeSampleSpec)
        samples[sample.uri] = sample
      }

      // Add further samples specifed in the yaml section.
      if (sampleSpecs) {
        for (const sampleId in sampleSpecs) {
          const sampleSpec = sampleSpecs[sampleId]
          sample = new Sample(mediaFile, sampleSpec)
          samples[sample.uri] = sample
        }
      }

      for (const sampleUri in samples) {
        samples[sampleUri].mediaElement = await createMediaElement(mediaFile)
      }
      return samples
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
   * 1. mediaFile
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
   * @param {module:@bldr/vue-plugin-media~mediaFileSpec} mediaFileSpec - URI
   *   or File object
   *
   * @returns {module:@bldr/vue-plugin-media.MediaFile}
   */
  async resolveSingle_ (mediaFileSpec) {
    let mediaFile

    // Remote uri to resolve
    if (typeof mediaFileSpec === 'string') {
      mediaFile = new MediaFile({ uri: mediaFileSpec })
      // Already resolved (URL from the internet for example)
      if (mediaFile.uriScheme === 'http' || mediaFile.uriScheme === 'https') {
        mediaFile.httpUrl = mediaFile.uri
        mediaFile.filenameFromHTTPUrl(mediaFile.uri)
        mediaFile.extensionFromString(mediaFile.uri)
        // Resolve HTTP URL
      } else if (mediaFile.uriScheme === 'id' || mediaFile.uriScheme === 'filename') {
        const response = await this.queryMediaServer_(mediaFile.uriScheme, mediaFile.uriAuthority)
        extractMediaUrisRecursive(response.data, this.linkedUris)
        mediaFile.addProperties(response.data)
        mediaFile.httpUrl = await this.resolveHttpUrl_(mediaFile)
        if (mediaFile.previewImage) {
          mediaFile.previewHttpUrl = `${mediaFile.httpUrl}_preview.jpg`
        }
      }
    // Local: File object from drag and drop or open dialog
    } else if (mediaFileSpec instanceof File) {
      const file = mediaFileSpec
      if (assetTypes.isAsset(file.name)) {
        // blob:http:/localhost:8080/8c00d9e3-6ff1-4982-a624-55f125b5c0c0
        const httpUrl = URL.createObjectURL(file)
        // 8c00d9e3-6ff1-4982-a624-55f125b5c0c0
        const uuid = httpUrl.substr(httpUrl.length - 36)
        // We use the uuid instead of the file name. The file name can contain
        // whitespaces and special characters. A uuid is  more reliable.
        const uri = `localfile:${uuid}`
        mediaFile = new MediaFile({
          uri: uri,
          httpUrl: httpUrl,
          filename: file.name
        })
      }
    }

    mediaFile.type = assetTypes.extensionToType(mediaFile.extension)
    // After type
    mediaFile.mediaElement = await createMediaElement(mediaFile)
    const samples = await this.createSamples_(mediaFile)
    if (samples) {
      mediaFile.samples = samples
    }
    return mediaFile
  }

  /**
   * Resolve one or more remote media files by URIs, HTTP URLs or
   * local media files by their file objects.
   *
   * Linked media URIs are resolve in a second step (not recursive). Linked
   * media assets are not allowed to have linked media URIs.
   *
   * @param {module:@bldr/vue-plugin-media~mediaFileSpecs} mediaFileSpecs
   */
  async resolve (mediaFileSpecs) {
    if (typeof mediaFileSpecs === 'string' || mediaFileSpecs instanceof File) {
      mediaFileSpecs = [mediaFileSpecs]
    }

    const uniqueSpecs = removeDuplicatesFromArray(mediaFileSpecs)

    // Resolve the main media URIs
    let promises = []
    for (const mediaFileSpec of uniqueSpecs) {
      promises.push(this.resolveSingle_(mediaFileSpec))
    }
    const mainMediaFiles = await Promise.all(promises)
    let linkMediaFiles = []
    // Resolve the linked media URIs.
    if (this.linkedUris.length) {
      promises = []
      for (const mediaUri of this.linkedUris) {
        promises.push(this.resolveSingle_(mediaUri))
      }
      linkMediaFiles = await Promise.all(promises)
    }
    return mainMediaFiles.concat(linkMediaFiles)
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
  /**
   * @param {object} router
   * @param {object} store
   * @param {object} shortcuts
   */
  constructor (router, store, shortcuts) {

    /**
     * A {@link https://router.vuejs.org/ vue router instance.}
     *
     * @type {Object}
     */
    this.$router = router

    /**
     * A {@link https://vuex.vuejs.org/ vuex store instance.}
     *
     * @type {Object}
     */
    this.$store = store
    this.$shortcuts = shortcuts

    /**
     * @type {module:@bldr/vue-plugin-media~Player}
     */
    this.player = new Player(store)

    /**
     * @type {module:@bldr/vue-plugin-media~PlayList}
     */
    this.playList = new PlayList(store, this.player)

    /**
     *  @type {module:@bldr/vue-plugin-media~Resolver}
     */
    this.resolver = new Resolver()

    /**
     *  @type {module:@bldr/http-request.HttpRequest}
     */
    this.httpRequest = httpRequest

    /**
     * @type {module:@bldr/vue-plugin-media~Canvas}
     */
    this.canvas = new Canvas()

    this.$shortcuts.addMultiple([
      {
        keys: 'space',
        callback: () => { this.player.toggle() },
        // Media player: Spiele/Pause
        description: 'Medien-Abspieler: Spiele/Pausiere'
      },
      {
        keys: 'p s',
        callback: () => { this.player.stop() },
        description: 'Medien-Abspieler: Stop'
      },
      {
        keys: 'p f',
        callback: () => { this.player.stop(4) },
        // Media player: fade out
        description: 'Medien-Abspieler: Audio/Video-Ausschnitt langsam ausblenden'
      },
      {
        keys: 'ctrl+space',
        callback: async () => {
          await this.player.start()
        },
        // Media player: Start loaded sample
        description: 'Medien-Abspieler: Starte geladenen Audio/Video-Ausschnitt'
      },
      {
        keys: 'ctrl+left',
        callback: () => { this.playList.startPrevious() },
        description: 'Medien-Abspieler: Spiele den vorhergehenden Ausschnitt.'
      },
      {
        keys: 'ctrl+right',
        callback: () => { this.playList.startNext() },
        description: 'Medien-Abspieler: Spiele den nächsten Ausschnitt.'
      },
      {
        keys: 'ctrl+shift+right',
        callback: () => { this.player.forward() },
        description: 'Medien-Abspieler: Um 10s nach vorne springen.'
      },
      {
        keys: 'ctrl+shift+left',
        callback: () => { this.player.backward() },
        description: 'Medien-Abspieler: Um 10s nach hinten springen.'
      }
    ])

    if (this.$router) {
      const style = {
        darkMode: false,
        centerVertically: false
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
          name: 'media-file',
          meta: {
            title: 'Media file',
            style
          },
          component: ComponentMediaFile
        }
      ]
      this.$router.addRoutes(routes)
      this.$shortcuts.fromRoute(routes[0])
    }
  }

  /**
   * Resolve media files by URIs. The media file gets stored in the vuex
   * store module `media`. Use getters to access the `mediaFile` objects.
   *
   * @param {module:@bldr/vue-plugin-media~mediaFileSpecs} mediaFileSpecs
   */
  async resolve (mediaFileSpecs) {
    const output = {}
    const mediaFiles = await this.resolver.resolve(mediaFileSpecs)
    for (const mediaFile of mediaFiles) {
      if (mediaFile.samples) {
        for (const sampleUri in mediaFile.samples) {
          this.$store.commit('media/addSample', mediaFile.samples[sampleUri])
        }
      }
      this.$store.dispatch('media/addMediaFile', mediaFile)
      output[mediaFile.uri] = mediaFile
    }
    this.addShortcutForMediaFiles_()
    this.addShortcutForSamples_()
    return output
  }

  /**
   * Add shortcuts for media files. At the momenten only for images. Video
   * and audio are samples and handled separately.
   */
  addShortcutForMediaFiles_ () {
    const mediaFiles = this.$store.getters['media/mediaFiles']
    let shortcutNo = 1
    for (const uri in mediaFiles) {
      const mediaFile = mediaFiles[uri]
      if (!mediaFile.shortcut && mediaFile.type === 'image') {
        mediaFile.shortcut = `i ${shortcutNo}`
        this.$shortcuts.add(
          mediaFile.shortcut,
          () => {
            this.canvas.hide()
            this.player.stop()
            this.canvas.show(mediaFile.mediaElement)
          },
          // Play
          `Zeige Bild „${mediaFile.titleSafe}“`
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
    const samples = this.$store.getters['media/samples']

    let firstTriggerKeyByType = (type) => {
      if (type === 'audio') {
        return 'a'
      } else if (type === 'video') {
        return 'v'
      }
    }

    let addShortcutsByType = (samples, type) => {
      let lastShortcutNo = 0
      for (const sampleUri in samples) {
        const sample = samples[sampleUri]
        if (!sample.shortcutCustom && sample.mediaFile.type === type) {
          if (sample.shortcutNo) {
            lastShortcutNo = sample.shortcutNo
          } else {
            lastShortcutNo += 1
            sample.shortcutNo = lastShortcutNo
            sample.shortcut = `${firstTriggerKeyByType(sample.mediaFile.type)} ${sample.shortcutNo}`
            this.$shortcuts.add(
              sample.shortcut,
              () => {
                // TODO: Start the same video twice behaves very strange.
                this.canvas.hide()
                this.player.load(sample.uri)
                this.player.start()
                if (sample.mediaFile.isVisible) {
                  this.canvas.show(sample.mediaElement)
                }
              },
              // Play
              `Spiele Ausschnitt „${sample.titleFormated}“`
            )
          }
        }
      }
    }

    let addShortcutsCustom = (samples) => {
      for (const sampleUri in samples) {
        const sample = samples[sampleUri]
        if (sample.shortcutCustom && !sample.shortcut) {
          sample.shortcut = sample.shortcutCustom
          this.$shortcuts.add(
            sample.shortcut,
            () => {
              this.player.load(sample.uri)
              this.player.start()
            },
            // Play
            `Spiele Ausschnitt „${sample.titleFormated}“`
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
  install (Vue, router, storeInstance, shortcuts) {
    if (!router) throw new Error('Pass in an instance of “VueRouter”.')
    if (!storeInstance) throw new Error('Pass in an instance of “Store”.')
    if (!shortcuts) throw new Error('Pass in an instance of “Shortcuts“.')

    Vue.use(DynamicSelect)

    if (storeInstance) storeInstance.registerModule('media', storeModule)
    // Make the store instance global for the media plugin.
    store = storeInstance

    Vue.filter('duration', formatDuration)
    /**
     * $media
     * @memberof module:@bldr/vue-app-presentation~Vue
     * @type {module:@bldr/vue-plugin-media~Media}
     */
    Vue.prototype.$media = new Media(router, storeInstance, shortcuts)
    // Vue.component('media-player', ComponentMediaPlayer)
    Vue.component('horizontal-play-buttons', ComponentHorizontalPlayButtons)
    Vue.component('play-button', ComponentPlayButton)
    Vue.component('media-canvas', ComponentMediaCanvas)
  }
}

export default Plugin
