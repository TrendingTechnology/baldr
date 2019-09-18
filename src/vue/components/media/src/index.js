/**
 * @file Resolve media files.
 */

import { getDefaultServers, Request } from '@bldr/http-request'
import Vue from 'vue'

export const request = new Request(getDefaultServers(), '/api/media-server')

class Player {
  constructor (store) {
    this.store_ = store
  }

  getPlaying_ () {
    return this.store_.getters['media/playing']
  }

  toHttpUrl_ (uriOrMediaFileObject) {
    const mixed = uriOrMediaFileObject
    if (typeof mixed === 'object') {
      return mixed.httpUrl
    }
    return this.store_.getters['media/httpUrlByUri'](mixed)
  }

  stop () {
    const audio = this.getPlaying_()
    if (!audio) return
    audio.pause()
    audio.currentTime = 0
    this.store_.commit('media/setPlaying', null)
  }

  start (uriOrMediaFileObject) {
    const url = this.toHttpUrl_(uriOrMediaFileObject)
    this.stop()
    const audio = new Audio(url)
    audio.volume = 1
    audio.currentTime = 0
    audio.play()
    this.store_.commit('media/setPlaying', audio)
  }

  fadeOut (duration = 3.1) {
    const audio = this.getPlaying_()
    if (!audio) return
    var actualVolume = audio.volume
    var steps = actualVolume / 100
    // in milliseconds: duration * 1000 / 100
    var delay = duration * 10
    var fadeOutInterval = setInterval(() => {
      actualVolume -= steps
      if (actualVolume >= 0) {
        audio.volume = actualVolume.toFixed(2)
      } else {
        this.stop()
        clearInterval(fadeOutInterval)
      }
    }, parseInt(delay))
  }
}

const state = {
  mediaFiles: {},
  restApiServers: [],
  playing: null
}

const getters = {
  playing: state => {
    return state.playing
  },
  mediaFiles: state => {
    return state.mediaFiles
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
  }
}

const mutations = {
  addMediaFile (state, mediaFile) {
    Vue.set(state.mediaFiles, mediaFile.uri, mediaFile)
  },
  setRestApiServers (state, restApiServers) {
    Vue.set(state, 'restApiServers', restApiServers)
  },
  setPlaying (state, audio) {
    state.playing = audio
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
    this.uri = decodeURI(this.uri)
    const segments = this.uri.split(':')
    this.uriScheme = segments[0]
    this.uriAuthority = segments[1]

    if ('filename' in this && !('extension' in this)) {
      this.extensionFromString(this.filename)
    }
    if ('extension' in this && !('type' in this)) {
      this.type = mediaTypes.extensionToType(this.extension)
    }
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
}

class Resolver {
  constructor (store) {
    this.store_ = store
  }

  /**
   *
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
    const storedMediaFile = this.store_.getters['media/mediaFileByUri'](uri)
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
    this.store_.commit('media/addMediaFile', mediaFile)
    return mediaFile
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
  constructor (router, store) {
    this.router_ = router
    this.store_ = store
    this.player = new Player(store)
    this.resolver = new Resolver(store)
  }

  /**
   * Resolve a media file by uri. The media file gets stored in the vuex
   * store module `media`. Use getters to access the `mediaFile` object.
   *
   * @param {string} uri - Uniform Resource Identifier, for example
   *   `id:Joseph_haydn` or `filename:beethoven.jpg`
   */
  resolve (uri) {
    this.resolver.getMediaFile(uri)
  }
}

// https://stackoverflow.com/a/56501461
// Vue.use(media, router, store)
const Plugin = {
  install (Vue, router, store) {
    if (store) store.registerModule('media', storeModule)
    Vue.prototype.$media = new Media(router, store)
  }
}

export default Plugin
