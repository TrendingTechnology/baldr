/**
 * @file Resolve media files.
 */

import { getDefaultServers, Request } from '@bldr/http-request'
import Vue from 'vue'

export const request = new Request(getDefaultServers(), '/api/media-server')

const state = {
  mediaFiles: {},
  restApiServers: []
}

const getters = {
  mediaFiles: state => {
    return state.mediaFiles
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
    Vue.set(state.mediaFiles, mediaFile.URI, mediaFile)
  },
  setRestApiServers (state, restApiServers) {
    Vue.set(state, 'restApiServers', restApiServers)
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
 * @property {string} URI - Uniform Resource Identifier, for example
 *   `id:Haydn_Joseph`, `filename:Haydn_Joseph.jpg` or
 *   `http://example.com/Haydn_Joseph.jpg`.
 * @property {string} uriScheme - for example: `http`, `https`, `blob`
 * @property {string} uriAuthority - for example:
 *   `//example.com/Haydn_Joseph.jpg`.
 * @property {string} httpURL - HTTP Uniform Resource Locator, for example
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
   * @param {object} mediaData - Mandatory properties are: `URI`
   */
  constructor (mediaData) {
    for (const property in mediaData) {
      this[property] = mediaData[property]
    }
    if (!('URI' in this)) {
      throw new Error('Media file needs a URI property.')
    }
    this.URI = decodeURI(this.URI)
    const segments = this.URI.split(':')
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

/**
 *
 */
class MediaResolver {
  constructor (router, store) {
    this.router_ = router
    this.store_ = store
    this.media = {}
  }

  /**
   *
   * @param {string} key
   * @param {string|json} value
   */
  async query (key, value) {
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
  async generateHttpURL (mediaFile) {
    if ('httpURL' in mediaFile) return mediaFile.httpURL
    if ('path' in mediaFile) {
      const baseURL = await request.getFirstBaseURL()
      return `${baseURL}/media/${mediaFile.path}`
    }
    throw new Error(`Can not generate HTTP URL.`)
  }

  /**
   * @param {string} URI - Uniform Resource Identifier
   *
   * @return {MediaFile}
   */
  async getMediaFile (URI) {
    if (URI in this.media) {
      return this.media[URI]
    }
    const mediaFile = new MediaFile({ URI: URI })

    if (mediaFile.uriScheme === 'http' || mediaFile.uriScheme === 'https') {
      mediaFile.httpURL = mediaFile.URI
      mediaFile.filenameFromHTTPUrl(mediaFile.URI)
      mediaFile.extensionFromString(mediaFile.URI)
    } else if (mediaFile.uriScheme === 'id' || mediaFile.uriScheme === 'filename') {
      const response = await this.query(mediaFile.uriScheme, mediaFile.uriAuthority)
      mediaFile.addProperties(response.data)
      mediaFile.httpURL = await this.generateHttpURL(mediaFile)
      if ('previewImage' in mediaFile) {
        mediaFile.previewHttpUrl = `${mediaFile.httpURL}_preview.jpg`
      }
    }

    mediaFile.type = mediaTypes.extensionToType(mediaFile.extension)
    this.media[URI] = mediaFile
    return mediaFile
  }

  /**
   * @param {string} URI - Uniform Resource Identifier
   *
   * @return {string} A HTTP URL (http://..)
   */
  async resolveHttpURL (URI) {
    let mediaFile = await this.getMediaFile(URI)
    return mediaFile.httpURL
  }
}

// https://stackoverflow.com/a/56501461
// Vue.use(mediaResolver, router, store)
const Plugin = {
  install (Vue, router, store) {
    if (store) store.registerModule('media', storeModule)
    Vue.prototype.$mediaResolver = new MediaResolver(router, store)
  }
}

export default Plugin
