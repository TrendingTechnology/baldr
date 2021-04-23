import type { AssetType } from '@bldr/type-definitions'

import { MimeTypeManager } from './mime-type'

/**
 * Hold various data of a media file as class properties.
 *
 * If a media file has a property with the name `multiPartCount` set, it is a
 * multi part asset. A multi part asset can be restricted to one part only by a
 * URI fragment (for example `#2`). The URI `id:Score#2` resolves always to the
 * HTTP URL `http:/example/media/Score_no02.png`.
 *
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
  raw: AssetType.FileFormat

  /**
   * The keyboard shortcut to play the media
   */
  shortcut?: string

  /**
   * The HTMLMediaElement of the media file.
   */
  mediaElement?: object

  /**
   * The media type, for example `image`, `audio` or `video`.
   */
  mimeType: string

  /**
   * @param mediaData - A raw javascript object read from the YAML files
   * (`*.extension.yml`)
   */
  constructor (raw: AssetType.FileFormat) {
    this.raw = raw

    if (raw.uri == null) {
      throw new Error('Every client media asset needs a uri property.')
    }

    if ('filename' in this && !('extension' in this)) {
      this.extensionFromString(this.filename)
    }
    if ('extension' in this && !('type' in this)) {
      /**
       * The media type, for example `image`, `audio` or `video`.
       * @type {string}
       */
      this.mimeType = MimeTypeManager.extensionToType(this.extension)
    }

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
