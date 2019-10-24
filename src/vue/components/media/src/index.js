/**
 * Resolve media files. Counter part of the BALDR media server.
 *
 * @module @bldr/vue-media
 */

/* globals document */

import { getDefaultServers, HttpRequest, getDefaultRestEndpoints, HttpRequestNg } from '@bldr/http-request'
import Vue from 'vue'
import DynamicSelect from '@bldr/vue-component-dynamic-select'

import ComponentMediaFile from './MediaFile.vue'
// documentation.js could not import without /index.vue
import MediaOverview from './MediaOverview/index.vue'
import MediaPlayer from './MediaPlayer.vue'

const restEndpoints = getDefaultRestEndpoints()
export const httpRequestNg = new HttpRequestNg(restEndpoints, '/api/media')
export const httpRequest = new HttpRequest(getDefaultServers(), '/api/media')

/**
 * @param {String} duration - in seconds
 *
 * @return {String}
 */
export function formatDuration(duration) {
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

/**
 *
 */
class Player {
  /**
   * @param {object} store - vuex store object.
   */
  constructor(store) {
    this.$store = store

    /**
     * We have to clear the timeouts. A not yet finished playbook with a
     * duration - stopped to early - cases that the next playback gets stopped
     * to early.
     */
    this.timeouts_ = []

    /**
     * We never stop. Instead we fade out very short and smoothly.
     */
    this.stopFadeOut_ = 0.5
  }

  set addTimeout_(timeoutId) {
    this.timeouts_.push(timeoutId)
  }

  /**
   * Clear all timeouts.
   *
   * We have to clear the timeout. A not yet finished playbook with a duration
   * - stopped during playback - cases that the next playback gets stopped to
   * early.
   */
  clearTimeouts_() {
    for (const timeoutId of this.timeouts_) {
      clearTimeout(timeoutId)
    }
    this.timeouts_ = []
  }

  /**
   * @param {String|Object} uriOrSample
   */
  load(uriOrSample) {
    let sample
    if (typeof uriOrSample === 'object') {
      sample = uriOrSample
    } else {
      sample = this.$store.getters['media/sampleByUri'](uriOrSample)
    }
    if (!sample) throw new Error(`sample couldn’t played`)
    this.$store.commit('media/sampleLoaded', sample)
  }

  /**
   * Play a sample from `sample.startTimeSec`.
   */
  async start() {
    const sample = this.$store.getters['media/sampleLoaded']
    if (!sample) throw new Error('First load a sample')
    const samplePlaying = this.$store.getters['media/samplePlaying']
    if (samplePlaying && sample.uri === samplePlaying.uri) {
      return
    }

    if (samplePlaying) await this.stop()

    // To prevent AbortError in Firefox, artefacts when switching through the
    // audio files.
    this.addTimeout_ = setTimeout(() => {
      this.$store.commit('media/samplePlaying', sample)
      sample.mediaElement.currentTime = sample.startTimeSec
      sample.mediaElement.play()
      sample.mediaElement.volume = 1

      if (sample.durationSec) {
        this.addTimeout_ = setTimeout(
          () => {
            this.fadeOut(this.stopFadeOut_)
          },
          (sample.durationSec - this.stopFadeOut_) * 1000
        )
      }
    }, 100)
  }

  /**
   * Stop the playback and reset the play position to `sample.startTimeSec`
   */
  async stop() {
    const sample = this.$store.getters['media/samplePlaying']
    if (!sample) return
    await this.fadeOut(this.stopFadeOut_)
    this.clearTimeouts_()
    sample.mediaElement.currentTime = sample.startTimeSec
    this.$store.commit('media/samplePlaying', null)
  }

  /**
   * @param {Number} duration - in seconds
   */
  fadeOut(duration = 3.1) {
    return new Promise((resolve, reject) => {
      const sample = this.$store.getters['media/samplePlaying']
      if (!sample) {
        reject()
      }
      let actualVolume = sample.mediaElement.volume
      const steps = actualVolume / 100
      // in milliseconds: duration * 1000 / 100
      const delay = duration * 10
      const fadeOutInterval = setInterval(() => {
        actualVolume -= steps
        if (actualVolume >= 0) {
          sample.mediaElement.volume = actualVolume.toFixed(2)
        } else {
          sample.mediaElement.pause()
          clearInterval(fadeOutInterval)
          resolve()
        }
      }, parseInt(delay))
    })
  }

  /**
   *
   */
  startPrevious() {
    this.stop()
    this.$store.dispatch('media/setMediaFilePrevious')
    this.play()
  }

  /**
   *
   */
  startNext() {
    this.stop()
    this.$store.dispatch('media/setMediaFileNext')
    this.play()
  }

  /**
   * Play a sample at the current position.
   */
  play() {
    const sample = this.$store.getters['media/samplePlaying']
    if (!sample || !sample.mediaElement) return
    sample.mediaElement.play()
  }

  /**
   * Pause a sample at the current position.
   */
  pause() {
    const sample = this.$store.getters['media/samplePlaying']
    if (!sample || !sample.mediaElement) return
    sample.mediaElement.pause()
  }

  /**
   *
   */
  toggle() {
    const sample = this.$store.getters['media/samplePlaying']
    if (!sample || !sample.mediaElement) return
    if (sample.mediaElement.paused) {
      this.play()
    } else {
      this.pause()
    }
  }
}

const state = {
  mediaFiles: {},
  mediaList: [],
  mediaNoCurrent: null,
  mediaTypes: {
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
  current: (state, getters) => {
    return getters.mediaFiles[getters.mediaList[getters.mediaNoCurrent - 1]]
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
    return state.mediaTypes[type]
  },
  mediaList: state => {
    return state.mediaList
  },
  mediaNoCurrent: state => {
    return state.mediaNoCurrent
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
    const samples = getters.samples
    if (uri in samples) {
      return samples[uri]
    }
    return null
  },
  typeCount: state => type => {
    return Object.keys(state.mediaTypes[type]).length
  }
}

const actions = {
  async setRestApiServers({ commit }) {
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
  addMediaFile({ commit, dispatch }, mediaFile) {
    commit('addMediaFile', mediaFile)
    commit('addMediaFileToTypes', mediaFile)
    dispatch('addMediaFileToList', mediaFile)
  },
  addMediaFileToList({ commit, getters }, mediaFile) {
    const list = getters.mediaList
    if (!list.includes(mediaFile.uri) && mediaFile.type !== 'image') {
      commit('addMediaFileToList', mediaFile)
    }
  },
  setMediaFileNext({ commit, getters }) {
    const no = getters.mediaNoCurrent
    const count = getters.mediaList.length
    if (no === count) {
      commit('setMediaNoCurrent', 1)
    } else {
      commit('setMediaNoCurrent', no + 1)
    }
  },
  setMediaFilePrevious({ commit, getters }) {
    const no = getters.mediaNoCurrent
    const count = getters.mediaList.length
    if (no === 1) {
      commit('setMediaNoCurrent', count)
    } else {
      commit('setMediaNoCurrent', no - 1)
    }
  },
  setMediaFileCurrent({ commit, getters }, mediaFile) {
    let no = null
    if (mediaFile) {
      no = getters.mediaList.indexOf(mediaFile.uri) + 1
    }
    commit('setMediaNoCurrent', no)
  }
}

const mutations = {
  addMediaFile(state, mediaFile) {
    Vue.set(state.mediaFiles, mediaFile.uri, mediaFile)
  },
  addMediaFileToList(state, mediaFile) {
    state.mediaList.push(mediaFile.uri)
  },
  addMediaFileToTypes(state, mediaFile) {
    Vue.set(state.mediaTypes[mediaFile.type], mediaFile.uri, mediaFile)
  },
  setRestApiServers(state, restApiServers) {
    Vue.set(state, 'restApiServers', restApiServers)
  },
  setMediaNoCurrent(state, no) {
    state.mediaNoCurrent = no
  },
  sampleLoaded(state, sample) {
    state.sampleLoaded = sample
  },
  samplePlaying(state, sample) {
    state.samplePlaying = sample
  },
  sample(state, sample) {
    Vue.set(state.samples, sample.uri, sample)
  }
}

const storeModule = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}

/**
 *
 */
class MediaTypes {
  constructor() {
    /**
     * @type {object}
     */
    this.types = {
      audio: ['mp3', 'm4a'],
      image: ['jpg', 'jpeg', 'png', 'svg'],
      video: ['mp4']
    }

    /**
     * @type {object}
     */
    this.typeColors = {
      audio: 'brown',
      image: 'green',
      video: 'purple'
    }
    /**
     * @type {array}
     */
    this.extensions_ = this.spreadExtensions_()
  }

  /**
   *
   */
  spreadExtensions_() {
    const out = {}
    for (const type in this.types) {
      for (const extension of this.types[type]) {
        out[extension] = type
      }
    }
    return out
  }

  /**
   *
   */
  extensionToType(extension) {
    const ext = extension.toLowerCase()
    if (ext in this.extensions_) {
      return this.extensions_[ext]
    }
    throw new Error(`Unkown extension “${ext}”`)
  }

  /**
   *
   */
  typeToColor(type) {
    return this.typeColors[type]
  }

  /**
   *
   */
  isMedia(filename) {
    const extension = filename.split('.').pop().toLowerCase()
    if (extension in this.extensions_) {
      return true
    }
    return false
  }
}

export const mediaTypes = new MediaTypes()

/**
 * A sample (snippet, sprite) of a media file which could be played. A sample
 * has typically a start time and a duration. If the start time is missing, the
 * media file gets played from the beginning. If the duration is missing, the
 * whole media file gets played.
 */
class Sample {
  /**
   * @param {MediaFile} mediaFile
   * @param {object} specs
   * @property {String} specs.title
   * @property {String|Number} specs.id
   * @property {String|Number} specs.startTime
   * @property {String|Number} specs.duration
   * @property {String|Number} specs.endTime
   */
  constructor(mediaFile, { title, id, startTime, duration, endTime }) {
    /**
     * @type {module:@bldr/vue-media.MediaFile}
     */
    this.mediaFile = mediaFile

    /**
     * @type {HTMLMediaElement}
     */
    this.mediaElement = null

    /**
     * @type {String}
     */
    this.title = title

    if (!id) throw new Error('A sample needs an id.')

    /**
     * @type {String}
     */
    this.id = id

    /**
     * `uri#id` for example `id:Beethoven#complete` `filename:beethoven.jpg#Theme_1`.
     * @type {String}
     */
    this.uri = `${this.mediaFile.uri}#${id}`

    /**
     * @type {Number}
     */
    this.startTimeSec = this.toSec_(startTime)

    if (duration && endTime) {
      throw new Error('Specifiy duration or endTime not both. They are mutually exclusive.')
    }

    /**
     * @type {Number}
     */
    this.durationSec = null
    duration = this.toSec_(duration)
    if (duration) {
      this.durationSec = duration
    } else if (endTime) {
      this.durationSec = this.toSec_(endTime) - this.startTimeSec
    }
  }

  /**
   * @param {String|Number} timeIntervaleString
   */
  toSec_(timeIntervaleString) {
    return Number(timeIntervaleString)
  }
}

/**
 * Hold various data of a media file as class properties.
 *
 * @property {string} uri - Uniform Resource Identifier, for example
 *   `id:Haydn`, `filename:Haydn_Joseph.jpg` or
 *   `http://example.com/Haydn_Joseph.jpg`.
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
 * @property {string} previewHttpUrl - Each media file can have a preview
 *   image. On the path is `_preview.jpg` appended.
 * @property {string} shortcut - The keyboard shortcut to play the media.
 * @property {Object} samples - An object of Sample instances.
 */
export class MediaFile {
  /**
   * @param {object} mediaData - Mandatory properties are: `uri`
   */
  constructor(mediaData) {
    for (const property in mediaData) {
      this[property] = mediaData[property]
    }
    if (!('uri' in this)) {
      throw new Error('Media file needs a uri property.')
    }

    /**
     * Uniform Resource Identifier, for example  `id:Haydn`,
     * `filename:Haydn_Joseph.jpg` or `http://example.com/Haydn_Joseph.jpg`.
     * @type {string}
     */
    this.uri = decodeURI(this.uri)
    const segments = this.uri.split(':')

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
      this.type = mediaTypes.extensionToType(this.extension)
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

  extensionFromString(string) {
    this.extension = string.split('.').pop().toLowerCase()
  }

  /**
   * Store the file name from a HTTP URL.
   *
   * @param {String} url
   */
  filenameFromHTTPUrl(url) {
    this.filename = url.split('/').pop()
  }

  /**
   * Merge an object into the class object.
   *
   * @param {object} properties - Add an object to the class properties.
   */
  addProperties(properties) {
    for (const property in properties) {
      this[property] = properties[property]
    }
  }

  /**
   * @type {String}
   */
  get titleSafe() {
    if ('title' in this) return this.title
    if ('filename' in this) return this.filename
    if ('uri' in this) return this.uri
  }

  /**
   * True if the media file is playable, for example an audio or a video file.
   *
   * @type {Boolean}
   */
  get isPlayable() {
    return ['audio', 'video'].includes(this.type)
  }

  /**
   * All plain text collected from the properties except some special properties.
   *
   * @type {string}
   */
  get plainText() {
    const output = []
    const excludedProperties = [
      'extension',
      'filename',
      'httpUrl',
      'id',
      'mediaElement',
      'path',
      'shortcut',
      'size',
      'previewImage',
      'previewHttpUrl',
      'timeModified',
      'type',
      'uri',
      'uriAuthority',
      'uriScheme'
    ]
    for (const property in this) {
      if (this.hasOwnProperty(property) && !excludedProperties.includes(property)) {
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
  get routerLink() {
    return `#/media/${this.uriScheme}/${this.uriAuthority}`
  }

  /**
   * Sort properties alphabetically a move some important ones to the beginnen
   * of the array
   *
   * @return {Array}
   */
  get propertiesSorted() {
    let properties = Object.keys(this)
    properties = properties.sort()
    function moveOnFirstPosition(properties, property) {
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
async function createMediaElement(mediaFile) {
  /**
   * Create a video element like `new Audio() does.`
   *
   * @param {String} src
   */
  function Video(src) {
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
      break

    case 'image':
      mediaElement = new Image()
      mediaElement.src = mediaFile.httpUrl
      break

    default:
      throw new Error(`Not supported mediaFile type “${mediaFile.type}”.`)
  }

  return new Promise(function (resolve, reject) {
    if (mediaFile.isPlayable) {
      mediaElement.onloadedmetadata = () => {
        resolve(mediaElement)
      }
    } else {
      mediaElement.onload = () => {
        resolve(mediaElement)
      }
    }

    mediaElement.onerror = () => {
      reject(Error("Could not create MediaElement."));
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

  /**
   * @private
   * @param {string} key
   * @param {string|json} value
   */
  async queryMediaServer_(key, value) {
    const response = await httpRequest.request(`query/asset/match/${key}/${value}`)
    if ('data' in response && 'path' in response.data) {
      return response
    }
    throw new Error(`Media with the ${key} ”${value}” couldn’t be resolved.`)
  }

  /**
   * @private
   * @param {MediaFile} mediaFile
   */
  async resolveHttpUrl_(mediaFile) {
    if ('httpUrl' in mediaFile) return mediaFile.httpUrl
    if ('path' in mediaFile) {
      const baseURL = await httpRequest.getFirstBaseUrl()
      return `${baseURL}/media/${mediaFile.path}`
    }
    throw new Error(`Can not generate HTTP URL.`)
  }

  async createSamples_(mediaFile) {
    // First sample of each playable media file is the complete track.
    if (mediaFile.isPlayable) {
      let sample
      const samples = {}
      sample = new Sample(
        mediaFile,
        {
          title: 'komplett',
          id: 'complete',
          startTime: 0
        }
      )
      samples[sample.uri] = sample
      // Add further samples specifed in the yaml section.
      if (mediaFile.samples) {
        for (let sampleSpec of mediaFile.samples) {
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
   * @param {module:@bldr/vue-media~mediaFileSpec} mediaFileSpec - URI or File object
   * @return {MediaFile}
   */
  async resolveSingle_(mediaFileSpec) {
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
        mediaFile.addProperties(response.data)
        mediaFile.httpUrl = await this.resolveHttpUrl_(mediaFile)
        if ('previewImage' in mediaFile) {
          mediaFile.previewHttpUrl = `${mediaFile.httpUrl}_preview.jpg`
        }
      }
      // Local: File object from drag and drop or open dialog
    } else if (mediaFileSpec instanceof File) {
      const file = mediaFileSpec
      if (mediaTypes.isMedia(file.name)) {
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

    mediaFile.type = mediaTypes.extensionToType(mediaFile.extension)
    // After type
    mediaFile.mediaElement = await createMediaElement(mediaFile)
    const samples = await this.createSamples_(mediaFile)
    if (samples) {
      mediaFile.samples = samples
    }
    return mediaFile
  }

  /**
   * Resolve one ore more remote media files by URIs, HTTP URLs or
   * local media files by their file objects.
   *
   * @param {module:@bldr/vue-media~mediaFileSpecs} mediaFileSpecs
   */
  resolve(mediaFileSpecs) {
    if (typeof mediaFileSpecs === 'string' || mediaFileSpecs instanceof File) {
      mediaFileSpecs = [mediaFileSpecs]
    }

    const uniqueSpecs = []
    for (const uri of mediaFileSpecs) {
      if (!uniqueSpecs.includes(uri)) {
        uniqueSpecs.push(uri)
      }
    }
    const promises = []
    for (const mediaFileSpec of uniqueSpecs) {
      promises.push(this.resolveSingle_(mediaFileSpec))
    }
    return Promise.all(promises)
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
  constructor(router, store, shortcuts) {
    this.$router = router
    this.$store = store
    this.$shortcuts = shortcuts

    /**
     * @type {module:@bldr/vue-media~Player}
     */
    this.player = new Player(store)

    /**
     *  @type {module:@bldr/vue-media~Resolver}
     */
    this.resolver = new Resolver()

    /**
     *  @type {module:@bldr/http-request.HttpRequest}
     */
    this.httpRequest = httpRequest

    this.$shortcuts.addMultiple([
      {
        keys: 'space',
        callback: () => { this.player.toggle() },
        description: 'Media player: play/pause'
      },
      {
        keys: 'p f',
        callback: () => { this.player.fadeOut() },
        description: 'Media player: fade out'
      },
    ])

    if (this.$router) {
      const style = {
        darkMode: false,
        centerVertically: false,
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
          component: MediaOverview
        },
        {
          path: '/media/:uriScheme/:uriAuthority',
          name: 'media-file',
          meta: {
            title: 'Media file',
            style
          },
          component: ComponentMediaFile
        },
      ]
      this.$router.addRoutes(routes)
      this.$shortcuts.fromRoute(routes[0])
    }
  }

  /**
   * Resolve media files by URIs. The media file gets stored in the vuex
   * store module `media`. Use getters to access the `mediaFile` objects.
   *
   * @param {module:@bldr/vue-media~mediaFileSpecs} mediaFileSpecs
   */
  async resolve(mediaFileSpecs) {
    const output = {}
    const mediaFiles = await this.resolver.resolve(mediaFileSpecs)
    for (const mediaFile of mediaFiles) {
      if (mediaFile.samples) {
        for (let sampleUri in mediaFile.samples) {
          this.$store.commit('media/sample', mediaFile.samples[sampleUri])
        }
      }
      this.$store.dispatch('media/addMediaFile', mediaFile)
      this.addShortcutForMediaFile_(mediaFile)
      output[mediaFile.uri] = mediaFile
    }
    return output
  }

  /**
   * @private
   */
  addShortcutForMediaFile_(mediaFile) {
    if (mediaFile.shortcut) return
    if (!mediaFile.isPlayable) return
    const number = this.$store.getters['media/typeCount'](mediaFile.type)
    let key
    switch (mediaFile.type) {
      case 'audio':
        key = 'a'
        break;

      case 'video':
        key = 'v'
        break;

      default:
        key = 'm'
        break;
    }
    const shortcut = `${key} ${number}`
    this.$shortcuts.add(
      shortcut,
      () => {
        this.player.load(mediaFile.uri)
        this.player.play()
      },
      `Play ${mediaFile.titleSafe}`
    )
    mediaFile.shortcut = shortcut
  }
}

// https://stackoverflow.com/a/56501461
// Vue.use(media, router, store, shortcuts)
const Plugin = {
  install(Vue, router, store, shortcuts) {
    if (!router) throw new Error('Pass in an instance of “VueRouter”.')
    if (!store) throw new Error('Pass in an instance of “Store”.')
    if (!shortcuts) throw new Error('Pass in an instance of “Shortcuts“.')

    Vue.use(DynamicSelect)

    if (store) store.registerModule('media', storeModule)

    Vue.filter('duration', formatDuration)
    /**
     * $media
     * @memberof module:@bldr/presentation~Vue
     * @type {module:@bldr/vue-media~Media}
     */
    Vue.prototype.$media = new Media(router, store, shortcuts)
    Vue.component('media-player', MediaPlayer)
  }
}

export default Plugin
