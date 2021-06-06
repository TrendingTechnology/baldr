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
import {
  formatMultiPartAssetFileName,
  convertHtmlToPlainText,
  selectSubset,
  removeDuplicatesFromArray
} from '@bldr/core-browser'
import { mimeTypeManager, MediaUri } from '@bldr/client-media-models'
import * as mediaResolver from '@bldr/media-resolver'
import DynamicSelect from '@bldr/dynamic-select'

import storeModule from './store.js'
import { registerComponents } from './components.js'
import { addRoutes } from './routes.js'

export const httpRequest = makeHttpRequestInstance(config, 'automatic','/api/media')

export const resolver = mediaResolver

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
 * Extract media URIs from an object to allow linked media assets inside
 * from media assets itself.
 *
 * ```yml
 * ---
 * title: Für Elise
 * ref: HB_Fuer-Elise
 * cover: ref:BD_Feuer-Elise
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
   * @param {String} uri - A string to test if it is a media URI (`ref:Sample1_HB`)
   *
   * @returns {Boolean}
   */
  function isMediaUri (uri) {
    if (uri && typeof uri === 'string' && uri.match(MediaUri.regExp)) {
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
      sample = store.getters['media/sampleNgByUri'](uri)
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
 * TODO: use from client-media-classes
 *
 * Hold various data of a media file as class properties.
 *
 * If a media file has a property with the name `multiPartCount` set, it is a
 * multi part asset. A multi part asset can be restricted to one part only by a
 * URI fragment (for example `#2`). The URI `ref:Score#2` resolves always to the
 * HTTP URL `http:/example/media/Score_no02.png`.
 *
 * @property {string} uri - Uniform Resource Identifier, for example `ref:Haydn`,
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
     * Uniform Resource Identifier, for example  `ref:Haydn`, or
     * `http://example.com/Haydn_Joseph.jpg`. The sample addition (`#complete`)
     * is removed.
     *
     * @type {string}
     */
    this.uri = decodeURI(this.uri.replace(/#.*$/, ''))
    const segments = this.uri.split(':')

    /**
     * for example: `ref`, `uuid`, `http`, `https`, `blob`
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
      this.type = mimeTypeManager.extensionToType(this.extension)
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
   * The URI using the `ref` authority.
   *
   * @returns {String}
   */
  get uriRef () {
    return `ref:${this.ref}`
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
      'mimeType',
      'extension',
      'filename',
      'httpUrl',
      'ref',
      'mediaElement',
      'categories',
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
    for (const property of ['ref', 'uri', 'title']) {
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
 * URI fragment (for example `#2`). The URI `ref:Score#2` resolves always to the
 * HTTP URL `http:/example/media/Score_no02.png`.
 */
class MultiPartSelection {
  /**
   * @param {module:@bldr/vue-app-media~MultiPartAsset} multiPartAsset
   * @param {String} selectionSpec - Can be a uri, everthing after `#`, for
   * example `ref:Song-2#2-5` -> `2-5`
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
     * `ref:Beethoven-9th#2,3,4,6-8`. A URI without a selection specification
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
   * The URI using the `ref` authority.
   *
   * @returns {String}
   */
  get uriRef () {
    if (!this.selectionSpec) {
      return this.asset.uriRef
    } else {
      return `${this.asset.uriRef}#${this.selectionSpec}`
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
   * @param {string} field - For example `ref` or `uuid`
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
   * @private
   *
   * @param {String} uri - For example `uuid:... ref:...`
   * @param {Object} data - Object from the REST API.
   *
   * @returns {module:@bldr/media-client.ClientMediaAsset}
   */
  createAssetFromRestData_ (uri, data) {
    let asset
    data.uri = uri
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
    if (mimeTypeManager.isAsset(file.name)) {
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
    asset.type = mimeTypeManager.extensionToType(asset.extension)
    // After type
    if (asset.type !== 'document') {
      asset.mediaElement = createMediaElement(asset)
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
      if (assetSpec.match(MediaUri.regExp)) {
        const uri = assetSpec.split(':')
        const response = await this.queryMediaServer_(uri[0], uri[1], throwException)
        if (response) asset = this.createAssetFromRestData_(assetSpec, response.data)
      } else if (throwException) {
        throw new Error(`Unkown media asset URI: “${assetSpec}”: Supported URI schemes: http,https,ref,uuid`)
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
      const asset = this.resolver.createAssetFromRestData_(`ref:${data.ref}`, data)
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
      this.setPreviewImagesFromCoverProp_()
    }

    await mediaResolver.resolver.resolve(assetSpecs, throwException)
    for (const asset of mediaResolver.resolver.getAssets()) {
      this.registerAssetShortcut(asset)
      store.commit('media/addAssetNg', asset)
    }

    for (const sample of mediaResolver.resolver.getSamples()) {
      this.registerSampleShortcut(sample)
      store.commit('media/addSampleNg', sample)
    }
    return output
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

    addRoutes(router, shortcuts)

    Vue.use(DynamicSelect)

    Vue.filter('duration', formatDuration)
    /**
     * $media
     * @memberof module:@bldr/lamp~Vue
     * @type {module:@bldr/media-client~Media}
     */
    Vue.prototype.$media = new Media()
    registerComponents(Vue)
  }
}

export default Plugin
