import type { AssetType } from '@bldr/type-definitions'

import { getExtension, formatMultiPartAssetFileName, selectSubset } from '@bldr/core-browser'
import { mimeTypeManager, MediaUri } from '@bldr/client-media-models'

import { assetCache, createHtmlElement, SampleCollection, MimeTypeShortcutCounter } from './internal'

export const imageShortcutCounter = new MimeTypeShortcutCounter('i')

/**
 * Hold various data of a media file as class properties.
 *
 * If a media file has a property with the name `multiPartCount` set, it is a
 * multi part asset. A multi part asset can be restricted to one part only by a
 * URI fragment (for example `#2`). The URI `ref:Score#2` resolves always to the
 * HTTP URL `http:/example/media/Score_no02.png`.
 */
export class ClientMediaAsset {
  /**
   * A raw javascript object read from the YAML files
   * (`*.extension.yml`)
   */
  yaml: AssetType.RestApiRaw

  uri: MediaUri

  /**
   * The keyboard shortcut to launch the media asset. At the moment only used by
   * images.
   */
  private shortcut_?: string

  /**
   * The HTMLMediaElement of the media file.
   */
  htmlElement?: object

  /**
   * The media type, for example `image`, `audio` or `video`.
   */
  mimeType: string

  /**
   * HTTP Uniform Resource Locator, for example
   * `http://localhost/media/Lieder/i/Ich-hab-zu-Haus-ein-Gramophon/HB/Ich-hab-zu-Haus-ein-Grammophon.m4a`.
   */
  httpUrl: string

  samples?: SampleCollection

  /**
   * @param yaml - A raw javascript object read from the Rest API
   */
  constructor (uri: string, httpUrl: string, yaml: AssetType.RestApiRaw) {
    this.uri = new MediaUri(uri)
    this.httpUrl = httpUrl
    this.yaml = yaml

    if (this.yaml.extension == null && this.yaml.filename != null) {
      const extension = getExtension(this.yaml.filename)
      if (extension != null) {
        this.yaml.extension = extension
      }
    }

    if (this.yaml.extension == null) {
      throw Error('The client media assets needs a extension')
    }

    this.mimeType = mimeTypeManager.extensionToType(this.yaml.extension)

    if (this.mimeType === 'image') {
      this.shortcut = imageShortcutCounter.get()
    }

    if (this.mimeType !== 'document') {
      this.htmlElement = createHtmlElement(this.mimeType, this.httpUrl)
    }

    if (this.isPlayable) {
      this.samples = new SampleCollection(this)
    }
    assetCache.add(this.ref, this)
  }

  /**
   * The reference authority of the URI using the `ref` scheme. The returned
   * string is prefixed with `ref:`.
   */
  get ref (): string {
    return 'ref:' + this.yaml.ref
  }

  /**
   * The UUID authority of the URI using the `uuid` scheme. The returned
   * string is prefixed with `uuid:`.
   */
  get uuid (): string {
    return 'uuid:' + this.yaml.uuid
  }

  set shortcut (value: string | undefined) {
    this.shortcut_ = value
  }

  get shortcut (): string | undefined {
    if (this.shortcut_ != null) {
      return this.shortcut_
    }
    if (this.samples?.complete != null) {
      return this.samples.complete.shortcut
    }
  }

  /**
   * Each media asset can have a preview image. The suffix `_preview.jpg`
   * is appended on the path. For example
   * `http://localhost/media/Lieder/i/Ich-hab-zu-Haus-ein-Gramophon/HB/Ich-hab-zu-Haus-ein-Grammophon.m4a_preview.jpg`
   */
  get previewHttpUrl (): string | undefined {
    if (this.yaml.previewImage) {
      return `${this.httpUrl}_preview.jpg`
    }
  }

  /**
   * Each meda asset can be associated with a waveform image. The suffix `_waveform.png`
   * is appended on the HTTP URL. For example
   * `http://localhost/media/Lieder/i/Ich-hab-zu-Haus-ein-Gramophon/HB/Ich-hab-zu-Haus-ein-Grammophon.m4a_waveform.png`
   */
  get waveformHttpUrl (): string | undefined {
    if (this.yaml.hasWaveform) {
      return `${this.httpUrl}_waveform.png`
    }
  }

  get titleSafe (): string {
    if (this.yaml.title != null) {
      return this.yaml.title
    }
    if (this.yaml.filename != null) {
      return this.yaml.filename
    }
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
   * The number of parts of a multipart media asset.
   */
  get multiPartCount (): number {
    if (this.yaml.multiPartCount == null) {
      return 1
    }
    return this.yaml.multiPartCount
  }

  /**
   * Retrieve the HTTP URL of the multi part asset by the part number.
   *
   * @param The part number starts with 1.
   */
  getMultiPartHttpUrlByNo (no: number): string {
    if (this.multiPartCount === 1) return this.httpUrl
    if (no > this.multiPartCount) {
      throw new Error(`The asset has only ${this.multiPartCount} parts, not ${no}`)
    }
    return formatMultiPartAssetFileName(this.httpUrl, no)
  }
}

/**
 * A multipart asset can be restricted in different ways. This class holds the
 * data of the restriction (for example all parts, only a single part, a
 * subset of parts). A multi part asset can be restricted to one part only by a
 * URI fragment (for example `#2`). The URI `ref:Score#2` resolves always to the
 * HTTP URL `http:/example/media/Score_no02.png`.
 */
export class MultiPartSelection {
  selectionSpec: string
  asset: ClientMediaAsset
  partNos: number[]

  /**
   * The URI of the media asset suffixed with the selection specification.
   * `ref:Beethoven-9th#2,3,4,6-8`. A URI without a selection specification
   * means all parts.
   */
  uri: string

  /**
   * @param selectionSpec - Can be a URI, everthing after `#`, for
   * example `ref:Song-2#2-5` -> `2-5`
   */
  constructor (asset: ClientMediaAsset, selectionSpec: string) {
    this.selectionSpec = selectionSpec.replace(/^.*#/, '')

    this.asset = asset

    if (this.selectionSpec == null) {
      this.uri = this.asset.uri.raw
    } else {
      this.uri = `${this.asset.uri.raw}#${this.selectionSpec}`
    }

    this.partNos = selectSubset(this.selectionSpec,
      { elementsCount: this.asset.multiPartCount, firstElementNo: 1 }
    )
  }

  /**
   * The URI using the `ref` authority.
   */
  get ref (): string {
    if (this.selectionSpec == null) {
      return this.asset.yaml.ref
    } else {
      return `${this.asset.yaml.ref}#${this.selectionSpec}`
    }
  }

  /**
   * The number of parts of a multipart media asset.
   */
  get multiPartCount (): number {
    return this.partNos.length
  }

  /**
   * Used for the preview to fake that this class is a normal asset.
   */
  get httpUrl (): string {
    return this.getMultiPartHttpUrlByNo(1)
  }

  /**
   * Retrieve the HTTP URL of the multi part asset by the part number.
   *
   * @param The part number starts with 1. We set a default value,
   * because no is sometimes undefined when only one part is selected. The
   * router then creates no step url (not /slide/1/step/1) but (/slide/1)
   */
  getMultiPartHttpUrlByNo (no = 1): string {
    return this.asset.getMultiPartHttpUrlByNo(this.partNos[no - 1])
  }
}
