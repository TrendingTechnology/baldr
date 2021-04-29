import type { AssetType } from '@bldr/type-definitions'
import { getExtension } from '@bldr/core-browser'

import { mimeTypeManager } from './mime-type'
import { MediaUri, MediaUriCache } from './media-uri'
import { Sample } from './sample'

/**
 * Hold various data of a media file as class properties.
 *
 * If a media file has a property with the name `multiPartCount` set, it is a
 * multi part asset. A multi part asset can be restricted to one part only by a
 * URI fragment (for example `#2`). The URI `id:Score#2` resolves always to the
 * HTTP URL `http:/example/media/Score_no02.png`.
 */
export class ClientMediaAsset {
  /**
   * A raw javascript object read from the YAML files
   * (`*.extension.yml`)
   */
  meta: AssetType.RestApiRaw

  uri: MediaUri

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

  httpUrl: string

  samples?: Sample[]

  /**
   * @param meta - A raw javascript object read from the Rest API
   */
  constructor (uri: string, httpUrl: string, meta: AssetType.RestApiRaw) {
    this.uri = new MediaUri(uri)
    this.httpUrl = httpUrl
    this.meta = meta

    if (this.meta.extension == null && this.meta.filename != null) {
      const extension = getExtension(this.meta.filename)
      if (extension != null) {
        this.meta.extension = extension
      }
    }

    if (this.meta.extension == null) {
      throw Error('The client media assets needs a extension')
    }

    this.mimeType = mimeTypeManager.extensionToType(this.meta.extension)

    this.samples = this.createSamples()
  }

  /**
   * The URI using the `id` scheme.
   */
  get id (): string {
    return this.meta.id
  }

  /**
   * The URI using the `uuid` scheme.
   */
  get uuid (): string {
    return this.meta.uuid
  }

  /**
   * Create samples for each playable media file. By default each media file
   * has one sample called “complete”.
   */
  private createSamples (): Sample[] | undefined {
    if (this.isPlayable) {
      // First sample of each playable media file is the “complete” track.
      // const completeSampleSpec = {
      //   title: 'komplett',
      //   id: 'complete',
      //   startTime: 0
      // }
      // for (const prop of ['startTime', 'duration', 'endTime', 'fadeOut', 'fadeIn', 'shortcut']) {
      //   if (asset[prop]) {
      //     completeSampleSpec[prop] = asset[prop]
      //     delete asset[prop]
      //   }
      // }

      // Store all sample specs in a object to check if there is already a
      // sample with the id “complete”.
      // let sampleSpecs = null
      // if (asset.samples) {
      //   sampleSpecs = {}
      //   for (const sampleSpec of asset.samples) {
      //     sampleSpecs[sampleSpec.id] = sampleSpec
      //   }
      // }

      // Create the sample “complete”.
      // let sample
      // const samples = {}
      // if (!sampleSpecs || (sampleSpecs && !('complete' in sampleSpecs))) {
      //   sample = new Sample(this, completeSampleSpec)
      //   samples[sample.uri] = sample
      // }

      const samples: Sample[] = []
      // Add further samples specifed in the yaml section.
      if (this.meta.samples != null) {
        for (const sampleSpec of this.meta.samples) {
          samples.push(new Sample(this, sampleSpec))
        }
      }

      // for (const sampleUri in samples) {
      //   samples[sampleUri].mediaElement = createMediaElement(asset)
      // }
      return samples
    }
  }

  /**
   * Store the file name from a HTTP URL.
   *
   * @param {String} url
   */
  // filenameFromHTTPUrl (url) {
  //   this.filename = url.split('/').pop()
  // }

  /**
   * Merge an object into the class object.
   *
   * @param {object} properties - Add an object to the class properties.
   */
  // addProperties (properties) {
  //   for (const property in properties) {
  //     this[property] = properties[property]
  //   }
  // }

  get titleSafe (): string {
    if (this.meta.title != null) return this.meta.title
    if (this.meta.filename != null) return this.meta.filename
    return this.uri.raw
  }

  /**
   * True if the media file is playable, for example an audio or a video file.
   */
  get isPlayable (): boolean {
    return ['audio', 'video'].includes(this.mimeType)
  }

  /**
   * True if the media file is visible, for example an image or a video file.
   */
  get isVisible (): boolean {
    return ['image', 'video'].includes(this.mimeType)
  }

  /**
   * All plain text collected from the properties except some special properties.
   *
   * @type {string}
   */
  // get plainText () {
  //   const output = []
  //   const excludedProperties = [
  //     'mimeType',
  //     'extension',
  //     'filename',
  //     'httpUrl',
  //     'id',
  //     'mediaElement',
  //     'categories',
  //     'musicbrainzRecordingId',
  //     'musicbrainzWorkId',
  //     'path',
  //     'previewHttpUrl',
  //     'previewImage',
  //     'samples',
  //     'mainImage',
  //     'shortcut',
  //     'size',
  //     'source',
  //     'timeModified',
  //     'type',
  //     'uri',
  //     'uriAuthority',
  //     'uriRaw',
  //     'uriScheme',
  //     'uuid',
  //     'wikidata',
  //     'youtube'
  //   ]
  //   for (const property in this) {
  //     if (this[property] && !excludedProperties.includes(property)) {
  //       output.push(this[property])
  //     }
  //   }
  //   return convertHtmlToPlainText(output.join(' | '))
  // }

  /**
   * The vue router link of the component `MediaAsset.vue`.
   *
   * Examples:
   * * `#/media/localfile/013b3960-af60-4184-9d87-7c3e723550b8`
   *
   * @type {string}
   */
  // get routerLink () {
  //   return `#/media/${this.uriScheme}/${this.uriAuthority}`
  // }

  /**
   * Sort properties alphabetically aand move some important ones to the
   * begining of the array.
   *
   * @return {Array}
   */
  // get propertiesSorted () {
  //   let properties = Object.keys(this)
  //   properties = properties.sort()
  //   function moveOnFirstPosition (properties, property) {
  //     properties = properties.filter(item => item !== property)
  //     properties.unshift(property)
  //     return properties
  //   }
  //   for (const property of ['id', 'uri', 'title']) {
  //     properties = moveOnFirstPosition(properties, property)
  //   }
  //   return properties
  // }

  /**
   * Dummy method. Has to be overwritten by the subclass `MultiPartAsset()`.
   * Returns `this.httpUrl`.
   * @returns {String}
   */
  // getMultiPartHttpUrlByNo (): string {
  //   return this.httpUrl
  // }
}

export class AssetCache {
  private cache: { [id: string]: ClientMediaAsset }

  private readonly mediaUriCache: MediaUriCache

  constructor () {
    this.cache = {}
    this.mediaUriCache = new MediaUriCache()
  }

  add (asset: ClientMediaAsset): boolean {
    if (this.mediaUriCache.addPair(asset.id, asset.uuid)) {
      this.cache[asset.id] = asset
      return true
    }
    return false
  }

  get (uuidOrId: string): ClientMediaAsset | undefined {
    const id = this.mediaUriCache.getId(uuidOrId)
    if (id != null && this.cache[id] != null) {
      return this.cache[id]
    }
  }

  getAll (): ClientMediaAsset[] {
    return Object.values(this.cache)
  }
}
