/**
 * @file Resolve media files.
 */

/* globals document */

import { getDefaultServers, HttpRequest, getDefaultRestEndpoints, HttpRequestNg } from '@bldr/http-request'
import Vue from 'vue'
import DynamicSelect from '@bldr/vue-component-dynamic-select'

import ComponentMediaFile from './MediaFile.vue'
import MediaOverview from './MediaOverview/index.vue'
import MediaPlayer from './MediaPlayer.vue'

const restEndpoints = getDefaultRestEndpoints()
export const httpRequestNg = new HttpRequestNg(restEndpoints, '/api/media')
export const httpRequest = new HttpRequest(getDefaultServers(), '/api/media')

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

function Video(src) {
  const video = document.createElement('video')
  video.src = src
  return video
}

class Player {
  constructor (store) {
    this.$store = store

    /**
     * We have to clear the timeout. A not yet finished playbook with a duration
     * - stopped to early - cases that the next playback gets stopped to early.
     */
    this.timeout_ = null

    /**
     * We never stop. Instead we fade out very short and smoothly.
     */
    this.stopFadeOut_ = 0.5
  }

  get mediaFile () {
    return this.$store.getters['media/current']
  }

  get mediaElement () {
    if (this.mediaFile) return this.mediaFile.mediaElement
  }

  /**
   * @param {String|Object} uriOrMediaFile
   * @param {Number} startTime  - in seconds
   * @param {Number} duration  - in seconds
   */
  async start (uriOrMediaFile, startTime, duration) {
    let mediaFile
    if (typeof uriOrMediaFile === 'object') {
      mediaFile = uriOrMediaFile
    } else {
      mediaFile = this.$store.getters['media/mediaFileByUri'](uriOrMediaFile)
    }
    if (!mediaFile) throw new Error(`mediaFile couldn’t played`)
    await this.stop()
    this.$store.dispatch('media/setMediaFileCurrent', mediaFile)

    // To prevent AbortError in Firefox, artefacts when switching through the
    // audio files.
    setTimeout(() => {
      this.mediaElement.volume = 1
      if (startTime) {
        this.mediaElement.currentTime = startTime
      } else {
        this.mediaElement.currentTime = 0
      }
      this.mediaElement.play()

      if (duration) {
        this.timeout_ = setTimeout(() => {
          this.fadeOut(this.stopFadeOut_)
        }, (duration - this.stopFadeOut_) * 1000)
      }
    }, 100)
  }

  async stop () {
    if (!this.mediaElement) return

    // We have to clear the timeout. A not yet finished playbook with a duration
    // - stopped to early - cases that the next playback gets stopped to early.
    if (this.timeout_) {
      clearTimeout(this.timeout_)
      this.timeout_ = null
    }
    //this.mediaElement.pause()
    await this.fadeOut(this.stopFadeOut_)
    this.mediaElement.currentTime = 0
  }

  startPrevious () {
    this.stop()
    this.$store.dispatch('media/setMediaFilePrevious')
    this.play()
  }

  startNext () {
    this.stop()
    this.$store.dispatch('media/setMediaFileNext')
    this.play()
  }

  play () {
    if (!this.mediaElement) return
    this.mediaElement.volume = 1
    this.mediaElement.play()
  }

  pause () {
    if (!this.mediaElement) return
    this.mediaElement.pause()
  }

  toggle () {
    if (!this.mediaElement) return
    if (this.mediaElement.paused) {
      this.play()
    } else {
      this.pause()
    }
  }

  /**
   * @param {Number} duration - in seconds
   */
  fadeOut (duration = 3.1) {
    return new Promise((resolve, reject) => {
      if (!this.mediaElement) {
        reject()
      }
      let actualVolume = this.mediaElement.volume
      const steps = actualVolume / 100
      // in milliseconds: duration * 1000 / 100
      const delay = duration * 10
      const fadeOutInterval = setInterval(() => {
        actualVolume -= steps
        if (actualVolume >= 0) {
          this.mediaElement.volume = actualVolume.toFixed(2)
        } else {
          this.mediaElement.pause()
          clearInterval(fadeOutInterval)
          resolve()
        }
      }, parseInt(delay))
    })
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
  restApiServers: []
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
  typeCount: state => type => {
    return Object.keys(state.mediaTypes[type]).length
  }
}

const actions = {
  async setRestApiServers ({ commit }) {
    const servers = await httpRequestNg.restEndpoints.getReachable()
    const versions = await httpRequestNg.request('version', 'all')
    const counts = await httpRequestNg.request('stats/count', 'all')
    const updates = await httpRequestNg.request('stats/updates', 'all')

    const result = []
    for (const endpointName in servers) {
      result.push({
        name:  servers[endpointName].name,
        baseUrl: servers[endpointName].baseUrl,
        version: versions[endpointName].data.version,
        count: counts[endpointName].data,
        update: updates[endpointName].data[0].begin,
        commitId: updates[endpointName].data[0].lastCommitId
      })
    }
    commit('setRestApiServers', result)
  },
  addMediaFile ({ commit, dispatch }, mediaFile) {
    commit('addMediaFile', mediaFile)
    commit('addMediaFileToTypes', mediaFile)
    dispatch('addMediaFileToList', mediaFile)
  },
  addMediaFileToList ({ commit, getters }, mediaFile) {
    const list = getters.mediaList
    if (!list.includes(mediaFile.uri) && mediaFile.type !== 'image') {
      commit('addMediaFileToList', mediaFile)
    }
  },
  setMediaFileNext ({ commit, getters }) {
    const no = getters.mediaNoCurrent
    const count = getters.mediaList.length
    if (no === count) {
      commit('setMediaNoCurrent', 1)
    } else {
      commit('setMediaNoCurrent', no + 1)
    }
  },
  setMediaFilePrevious ({ commit, getters }) {
    const no = getters.mediaNoCurrent
    const count = getters.mediaList.length
    if (no === 1) {
      commit('setMediaNoCurrent', count)
    } else {
      commit('setMediaNoCurrent', no - 1)
    }
  },
  setMediaFileCurrent ({ commit, getters }, mediaFile) {
    let no = null
    if (mediaFile) {
      no = getters.mediaList.indexOf(mediaFile.uri) + 1
    }
    commit('setMediaNoCurrent', no)
  }
}

const mutations = {
  addMediaFile (state, mediaFile) {
    Vue.set(state.mediaFiles, mediaFile.uri, mediaFile)
  },
  addMediaFileToList (state, mediaFile) {
    state.mediaList.push(mediaFile.uri)
  },
  addMediaFileToTypes (state, mediaFile) {
    Vue.set(state.mediaTypes[mediaFile.type], mediaFile.uri, mediaFile)
  },
  setRestApiServers (state, restApiServers) {
    Vue.set(state, 'restApiServers', restApiServers)
  },
  setMediaNoCurrent (state, no) {
    state.mediaNoCurrent = no
  }
}

const storeModule = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}

class MediaTypes {
  constructor () {
    this.types = {
      audio: ['mp3', 'm4a'],
      image: ['jpg', 'jpeg', 'png', 'svg'],
      video: ['mp4']
    }

    this.typeColors = {
      audio: 'brown',
      image: 'green',
      video: 'purple'
    }
    this.extensions_ = this.spreadExtensions_()
  }

  spreadExtensions_ () {
    const out = {}
    for (const type in this.types) {
      for (const extension of this.types[type]) {
        out[extension] = type
      }
    }
    return out
  }

  extensionToType (extension) {
    const ext = extension.toLowerCase()
    if (ext in this.extensions_) {
      return this.extensions_[ext]
    }
    throw new Error(`Unkown extension “${ext}”`)
  }

  typeToColor (type) {
    return this.typeColors[type]
  }

  isMedia (filename) {
    const extension = filename.split('.').pop().toLowerCase()
    if (extension in this.extensions_) {
      return true
    }
    return false
  }
}

export const mediaTypes = new MediaTypes()

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

  extensionFromString (string) {
    this.extension = string.split('.').pop().toLowerCase()
  }

  filenameFromHTTPUrl (URL) {
    this.filename = URL.split('/').pop()
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

  get titleSafe () {
    if ('title' in this) return this.title
    if ('filename' in this) return this.filename
    if ('uri' in this) return this.uri
  }

  get isPlayable () {
    return ['audio', 'video'].includes(this.type)
  }

  get plainText () {
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
}

/**
 * Order of resolution:
 *
 * 1. mediaFile
 * 2. httpUrl
 * 3. mediaElement
 */
class Resolver {

  /**
   * @param {string} key
   * @param {string|json} value
   */
  async queryMediaServer_ (key, value) {
    const response = await httpRequest.request(`query/asset/match/${key}/${value}`)
    if ('data' in response && 'path' in response.data) {
      return response
    }
    throw new Error(`Media with the ${key} ”${value}” couldn’t be resolved.`)
  }

  resolveMediaElement_ (mediaFile) {
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

    return new Promise(function(resolve, reject) {
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
        reject(Error("It broke"));
      }
    })
  }

  async resolveHttpUrl_ (mediaFile) {
    if ('httpUrl' in mediaFile) return mediaFile.httpUrl
    if ('path' in mediaFile) {
      const baseURL = await httpRequest.getFirstBaseUrl()
      return `${baseURL}/media/${mediaFile.path}`
    }
    throw new Error(`Can not generate HTTP URL.`)
  }

  /**
   * Order of resolution:
   *
   * 1. mediaFile
   * 2. httpUrl
   * 3. mediaElement
   */
  async resolveMediaFile_ (uri) {
    const mediaFile = new MediaFile({ uri: uri })
    if (mediaFile.uriScheme === 'http' || mediaFile.uriScheme === 'https') {
      mediaFile.httpUrl = mediaFile.uri
      mediaFile.filenameFromHTTPUrl(mediaFile.uri)
      mediaFile.extensionFromString(mediaFile.uri)
    } else if (mediaFile.uriScheme === 'id' || mediaFile.uriScheme === 'filename') {
      const response = await this.queryMediaServer_(mediaFile.uriScheme, mediaFile.uriAuthority)
      mediaFile.addProperties(response.data)
      mediaFile.httpUrl = await this.resolveHttpUrl_(mediaFile)
      if ('previewImage' in mediaFile) {
        mediaFile.previewHttpUrl = `${mediaFile.httpUrl}_preview.jpg`
      }
    }
    mediaFile.type = mediaTypes.extensionToType(mediaFile.extension)
    // After type
    mediaFile.mediaElement = await this.resolveMediaElement_(mediaFile)
    return mediaFile
  }

  /**
   * @param {File} file - File object https://developer.mozilla.org/de/docs/Web/API/File
   */
  async resolveMediaFileFileSystem_ (file) {
    if (mediaTypes.isMedia(file.name)) {
      const httpUrl = URL.createObjectURL(file)
      const uri = `localfile:${file.name}`
      const mediaFile = new MediaFile({
        uri: uri,
        httpUrl: httpUrl,
        filename: file.name
      })
      mediaFile.type = mediaTypes.extensionToType(mediaFile.extension)
      // After type
      mediaFile.mediaElement = await this.resolveMediaElement_(mediaFile)
      return mediaFile
    }
  }

  /**
   * Resolve media files by URIs.
   *
   * @param {string|array} uris - A single URI as a string or a array of URIs.
   *   Uniform Resource Identifier, for example
   *   `id:Joseph_haydn` or `filename:beethoven.jpg`
   */
  resolve (uris) {
    if (typeof uris === 'string') uris = [uris]
    const uniqueUris = []
    for (const uri of uris) {
      if (!uniqueUris.includes(uri)) {
        uniqueUris.push(uri)
      }
    }
    const promises = []
    for (const uri of uniqueUris) {
      promises.push(this.resolveMediaFile_(uri))
    }
    return Promise.all(promises)
  }
}

/**
 *
 */
class Media {
  constructor (router, store, shortcuts) {
    this.$router = router
    this.$store = store
    this.$shortcuts = shortcuts

    /**
     *
     */
    this.player = new Player(store)

    /**
     *
     */
    this.resolver = new Resolver()

    /**
     *
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
   * @param {string|array} uris - A single URI as a string or a array of URIs.
   *   Uniform Resource Identifier, for example
   *   `id:Joseph_haydn` or `filename:beethoven.jpg`
   */
  async resolve (uris) {
    const output = {}
    const mediaFiles = await this.resolver.resolve(uris)
    for (const mediaFile of mediaFiles) {
      this.$store.dispatch('media/addMediaFile', mediaFile)
      this.addShortcutForMediaFile_(mediaFile)
      output[mediaFile.uri] = mediaFile
    }
    return output
  }

  addShortcutForMediaFile_ (mediaFile) {
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
        this.player.start(mediaFile.uri)
      },
      `Play ${mediaFile.titleSafe}`
    )
    mediaFile.shortcut = shortcut
  }

  async addFromFileSystem (file) {
    const mediaFile = await this.resolver.resolveMediaFileFileSystem_(file)
    if (mediaFile) {
      this.$store.dispatch('media/addMediaFile', mediaFile)
      this.addShortcutForMediaFile_(mediaFile)
    }
  }
}

// https://stackoverflow.com/a/56501461
// Vue.use(media, router, store, shortcuts)
const Plugin = {
  install (Vue, router, store, shortcuts) {
    if (!router) throw new Error('Pass in an instance of “VueRouter”.')
    if (!store) throw new Error('Pass in an instance of “Store”.')
    if (!shortcuts) throw new Error('Pass in an instance of “Shortcuts“.')

    Vue.use(DynamicSelect)

    if (store) store.registerModule('media', storeModule)

    Vue.filter('duration', formatDuration)
    Vue.prototype.$media = new Media(router, store, shortcuts)
    Vue.component('media-player', MediaPlayer)
  }
}

export default Plugin
