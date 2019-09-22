/**
 * @file Resolve media files.
 */

/* globals document */

import { getDefaultServers, Request } from '@bldr/http-request'
import Vue from 'vue'
import AudioVisual from 'vue-audio-visual'
import MediaOverview from './MediaOverview.vue'

export const request = new Request(getDefaultServers(), '/api/media-server')

function Video(src) {
  const video = document.createElement('video')
  video.src = src
  return video
}

class Player {
  constructor (store) {
    this.$store = store
  }

  getCurrentMediaFile_ () {
    return this.$store.getters['media/current']
  }

  getCurrentMediaElement_ () {
    const mediaFile = this.getCurrentMediaFile_()
    if (mediaFile) return mediaFile.mediaElement
  }

  toMediaFile_ (uriOrMediaFile) {
    if (typeof uriOrMediaFile === 'object') {
      return uriOrMediaFile
    }
    return this.$store.getters['media/mediaFileByUri'](uriOrMediaFile)
  }

  load (uriOrMediaFile) {
    const mediaFile = this.toMediaFile_(uriOrMediaFile)
    if (mediaFile) {
      if (mediaFile.type === 'audio') {
        mediaFile.mediaElement = new Audio(mediaFile.httpUrl)
      } else if (mediaFile.type === 'video') {
        mediaFile.mediaElement = new Video(mediaFile.httpUrl)
      } else {
        throw new Error('Can not play media file.')
      }
      this.stop()
      this.unload()
      this.$store.commit('media/setCurrent', mediaFile)
      return mediaFile
    }
  }

  unload () {
    const mediaFile = this.getCurrentMediaFile_()
    if (mediaFile) {
      mediaFile.mediaElement.remove()
      this.$store.commit('media/setCurrent', null)
    }
  }

  stop () {
    const mediaElement = this.getCurrentMediaElement_()
    if (!mediaElement) return
    mediaElement.pause()
    mediaElement.currentTime = 0
  }

  pause () {
    const mediaElement = this.getCurrentMediaElement_()
    if (!mediaElement) return
    mediaElement.pause()
  }

  start (uriOrMediaFile) {
    this.load(uriOrMediaFile)
    let mediaElement = this.getCurrentMediaElement_()
    mediaElement.volume = 1
    mediaElement.currentTime = 0
    mediaElement.play()
  }

  play () {
    const mediaElement = this.getCurrentMediaElement_()
    if (!mediaElement) return
    mediaElement.volume = 1
    mediaElement.play()
  }

  toggle () {
    const mediaElement = this.getCurrentMediaElement_()
    if (!mediaElement) return
    if (mediaElement.paused) {
      this.play()
    } else {
      this.pause()
    }
  }

  fadeOut (duration = 3.1) {
    const mediaElement = this.getCurrentMediaElement_()
    if (!mediaElement) return
    var actualVolume = mediaElement.volume
    var steps = actualVolume / 100
    // in milliseconds: duration * 1000 / 100
    var delay = duration * 10
    var fadeOutInterval = setInterval(() => {
      actualVolume -= steps
      if (actualVolume >= 0) {
        mediaElement.volume = actualVolume.toFixed(2)
      } else {
        this.stop()
        clearInterval(fadeOutInterval)
      }
    }, parseInt(delay))
  }
}

const state = {
  mediaFiles: {},
  mediaTypes: {
    audio: {},
    video: {},
    image: {}
  },
  restApiServers: [],
  current: null
}

const getters = {
  current: state => {
    return state.current
  },
  mediaFiles: state => {
    return state.mediaFiles
  },
  typeCount: state => type => {
    return Object.keys(state.mediaTypes[type]).length
  },
  mediaFileByUri: (state, getters) => uri => {
    const media = getters.mediaFiles
    if (uri in media) {
      return media[uri]
    }
    return null
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
  restApiServers: state => {
    return state.restApiServers
  }
}

const actions = {
  async setRestApiServers ({ commit }) {
    const servers = await request.getServers()
    commit('setRestApiServers', servers)
  },
  addMediaFile ({ commit }, mediaFile) {
    commit('addMediaFile', mediaFile)
    commit('addMediaFileToTypes', mediaFile)
  }
}

const mutations = {
  addMediaFile (state, mediaFile) {
    Vue.set(state.mediaFiles, mediaFile.uri, mediaFile)
  },
  addMediaFileToTypes (state, mediaFile) {
    Vue.set(state.mediaTypes[mediaFile.type], mediaFile.uri, mediaFile)
  },
  setRestApiServers (state, restApiServers) {
    Vue.set(state, 'restApiServers', restApiServers)
  },
  setCurrent (state, audio) {
    state.current = audio
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
      image: ['jpg', 'jpeg', 'png'],
      video: ['mp4']
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
 *   `id:Haydn_Joseph`, `filename:Haydn_Joseph.jpg` or
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
 * @property {string} keyboard - The keyboard shortcut to play the media.
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
     * Uniform Resource Identifier, for example  `id:Haydn_Joseph`,
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
}

class Resolver {
  constructor (store) {
    this.$store = store
  }

  /**
   * @param {string} key
   * @param {string|json} value
   */
  async queryMediaServer_ (key, value) {
    const postBody = {}
    postBody[key] = value
    const response = await request.request(
      {
        method: 'post',
        url: `query-by-${key}`,
        data: postBody
      }
    )
    if ('data' in response && 'path' in response.data) {
      return response
    }
    throw new Error(`Media with the ${key} ”${value}” couldn’t be resolved.`)
  }

  /**
   * @param {MediaFile} mediaFile
   *
   * @return {string} HTTP URL
   */
  async resolveHttpUrl_ (mediaFile) {
    if ('httpUrl' in mediaFile) return mediaFile.httpUrl
    if ('path' in mediaFile) {
      const baseURL = await request.getFirstBaseUrl()
      return `${baseURL}/media/${mediaFile.path}`
    }
    throw new Error(`Can not generate HTTP URL.`)
  }

  /**
   * @param {string} uri - Uniform Resource Identifier, for example
   *   `id:Joseph_haydn` or `filename:beethoven.jpg`
   *
   * @return {MediaFile}
   */
  async getMediaFile (uri) {
    const storedMediaFile = this.$store.getters['media/mediaFileByUri'](uri)
    if (storedMediaFile) return storedMediaFile

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
    this.storeMediaFile(mediaFile)
    return mediaFile
  }

  storeMediaFile (mediaFile) {
    this.$store.dispatch('media/addMediaFile', mediaFile)
  }

  /**
   * @param {string} uri - Uniform Resource Identifier, for example
   *   `id:Joseph_haydn` or `filename:beethoven.jpg`
   *
   * @return {string} A HTTP URL (http://..)
   */
  async getHttpURL (uri) {
    let mediaFile = await this.getMediaFile(uri)
    return mediaFile.httpUrl
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
    this.player = new Player(store)
    this.resolver = new Resolver(store)

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
      const route = {
        path: '/media',
        shortcut: 'm',
        title: 'Media',
        component: MediaOverview
      }
      this.$router.addRoutes([route])
      this.$shortcuts.fromRoute(route)
    }
  }

  /**
   * Resolve a media file by uri. The media file gets stored in the vuex
   * store module `media`. Use getters to access the `mediaFile` object.
   *
   * @param {string} uri - Uniform Resource Identifier, for example
   *   `id:Joseph_haydn` or `filename:beethoven.jpg`
   */
  async resolve (uri) {
    const mediaFile = await this.resolver.getMediaFile(uri)
    this.addShortcutForMediaFile_(mediaFile)
  }

  addShortcutForMediaFile_ (mediaFile) {
    if (mediaFile.shortcut) return
    if (!['audio', 'video'].includes(mediaFile.type)) return
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

  addFromFileSystem (file) {
    if (mediaTypes.isMedia(file.name)) {
      const httpUrl = URL.createObjectURL(file)
      const uri = `localfile:${file.name}`
      const mediaFile = new MediaFile({
        uri: uri,
        httpUrl: httpUrl,
        filename: file.name
      })
      this.resolver.storeMediaFile(mediaFile)
      this.addShortcutForMediaFile_(mediaFile)
    }
  }
}

// https://stackoverflow.com/a/56501461
// Vue.use(media, router, store)
const Plugin = {
  install (Vue, router, store, shortcuts) {
    if (!router || router.constructor.name !== 'VueRouter') {
      throw new Error('Pass a instance of VueRouter')
    }

    if (!store || store.constructor.name !== 'Store') {
      throw new Error('Pass a instance of Store')
    }

    if (!shortcuts || shortcuts.constructor.name !== 'Shortcuts') {
      throw new Error('Pass a instance of Shortcuts')
    }

    Vue.use(AudioVisual)
    if (store) store.registerModule('media', storeModule)
    Vue.prototype.$media = new Media(router, store, shortcuts)
  }
}

export default Plugin
