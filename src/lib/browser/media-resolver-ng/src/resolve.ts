import * as api from '@bldr/api-wrapper'
import { getConfig } from '@bldr/config-ng'
import { makeHttpRequestInstance } from '@bldr/http-request'
import { makeSet } from '@bldr/core-browser'
import { MediaUri, findMediaUris } from '@bldr/client-media-models'

import { ClientMediaAsset } from './asset'
import { UriTranslator, Cache, MimeTypeShortcutCounter } from './cache'
import { Sample, Asset, RestApiRaw } from './types'

const config = getConfig()

type UrisSpec = string | string[] | Set<string>

class SampleCache extends Cache<Sample> {
  uriTranslator: UriTranslator

  constructor (translator: UriTranslator) {
    super()
    this.uriTranslator = translator
  }

  get (uuidOrRef: string): Sample | undefined {
    const ref = this.uriTranslator.getRef(uuidOrRef)
    if (ref != null) {
      return super.get(ref)
    }
  }
}

class AssetCache extends Cache<Asset> {
  uriTranslator: UriTranslator

  constructor (translator: UriTranslator) {
    super()
    this.uriTranslator = translator
  }

  add (ref: string, asset: Asset): boolean {
    if (this.uriTranslator.addPair(asset.ref, asset.uuid)) {
      super.add(ref, asset)
      return true
    }
    return false
  }

  get (uuidOrRef: string): Asset | undefined {
    const ref = this.uriTranslator.getRef(uuidOrRef)
    if (ref != null) {
      return super.get(ref)
    }
  }

  getMultiple (uuidOrRefs: string | string[] | Set<string>): Asset[] {
    if (typeof uuidOrRefs === 'string') {
      uuidOrRefs = [uuidOrRefs]
    }
    const output: Asset[] = []
    for (const uuidOrRef of uuidOrRefs) {
      const asset = this.get(uuidOrRef)
      if (asset != null) {
        output.push(asset)
      }
    }
    return output
  }
}

/**
 * Manager to set shortcuts on  three MIME types (audio, video, image).
 */
class ShortcutManager {
  private readonly audio: MimeTypeShortcutCounter
  private readonly video: MimeTypeShortcutCounter
  private readonly image: MimeTypeShortcutCounter

  constructor () {
    this.audio = new MimeTypeShortcutCounter('a')
    this.video = new MimeTypeShortcutCounter('v')
    this.image = new MimeTypeShortcutCounter('i')
  }

  setOnSample (sample: Sample): void {
    if (sample.shortcut != null) {
      return
    }
    if (sample.asset.mimeType === 'audio') {
      sample.shortcut = this.audio.get()
    } else if (sample.asset.mimeType === 'video') {
      sample.shortcut = this.video.get()
    }
  }

  setOnAsset (asset: Asset): void {
    if (asset.shortcut != null) {
      return
    }
    if (asset.mimeType === 'image') {
      asset.shortcut = this.audio.get()
    }
  }

  reset (): void {
    this.audio.reset()
    this.video.reset()
    this.image.reset()
  }
}

/**
 * Resolve (get the HTTP URL and some meta informations) of a remote media
 * file by its URI. Create media elements for each media file. Create samples
 * for playable media files.
 */
export class Resolver {
  private readonly httpRequest = makeHttpRequestInstance(
    config,
    'automatic',
    '/api/media'
  )

  private readonly sampleCache: SampleCache
  private readonly assetCache: AssetCache
  private readonly uriTranslator: UriTranslator
  private readonly shortcutManager: ShortcutManager

  /**
   * Assets with linked assets have to be cached. For example: many
   * audio assets can have the same cover ID.
   */
  private cache: { [uri: string]: RestApiRaw }

  constructor () {
    this.cache = {}
    this.uriTranslator = new UriTranslator()
    this.sampleCache = new SampleCache(this.uriTranslator)
    this.assetCache = new AssetCache(this.uriTranslator)
    this.shortcutManager = new ShortcutManager()
  }

  /**
   * Query the media server to get meta informations and the location of the file.
   *
   * @param uri - For example `ref:Fuer-Elise`
   * @param throwException - Throw an exception if the media URI
   *  cannot be resolved (default: `true`).
   */
  private async queryMediaServer (
    uri: string,
    throwException: boolean = true
  ): Promise<RestApiRaw | undefined> {
    const mediaUri = new MediaUri(uri)
    const cacheKey = mediaUri.uriWithoutFragment
    if (this.cache[cacheKey] != null) {
      return this.cache[cacheKey]
    }
    const asset = await api.getAssetByUri(uri, throwException)
    const rawRestApiAsset: RestApiRaw = asset
    this.cache[cacheKey] = rawRestApiAsset
    return rawRestApiAsset
  }

  /**
   * Create a new media asset. The samples are created in the constructor of
   * the media asset.
   *
   * @param uri - A media URI (Uniform Resource Identifier) with an optional
   *   fragment suffix, for example `ref:Yesterday#complete`. The fragment
   *   suffix is removed.
   * @param raw - The raw object from the REST API and YAML metadata file.
   *
   * @returns The newly created media asset.
   */
  private createAsset (uri: string, raw: RestApiRaw): Asset {
    const httpUrl = `${this.httpRequest.baseUrl}/${config.mediaServer.urlFillIn}/${raw.path}`
    const asset = new ClientMediaAsset(uri, httpUrl, raw)
    this.assetCache.add(asset.ref, asset)
    this.shortcutManager.setOnAsset(asset)
    if (asset.samples != null) {
      for (const sample of asset.samples) {
        if (this.sampleCache.add(sample.ref, sample)) {
          this.shortcutManager.setOnSample(sample)
        }
      }
    }
    return asset
  }

  /**
   * Resolve (get the HTTP URL and some meta informations) of a remote media
   * file by its URI.
   *
   * @param uri - A media URI (Uniform Resource Identifier) with an optional
   *   fragment suffix, for example `ref:Yesterday#complete`. The fragment
   *   suffix is removed.
   * @param throwException - Throw an exception if the media URI
   *  cannot be resolved (default: `true`).
   */
  private async resolveSingle (
    uri: string,
    throwException: boolean = true
  ): Promise<Asset | undefined> {
    const cachedAsset = this.assetCache.get(uri)
    if (cachedAsset != null) {
      return cachedAsset
    }
    const raw = await this.queryMediaServer(uri, throwException)
    if (raw != null) {
      return this.createAsset(uri, raw)
    }
  }

  /**
   * Resolve one or more remote media files by URIs.
   *
   * Linked media URIs are resolved recursively.
   *
   * @param uris - A single media URI or an array of media URIs.
   * @param throwException - Throw an exception if the media URI
   *  cannot be resolved (default: `true`).
   */
  public async resolve (
    uris: UrisSpec,
    throwException: boolean = true
  ): Promise<Asset[]> {
    const mediaUris = makeSet(uris)
    const urisWithoutFragments = new Set<string>()
    for (const uri of mediaUris) {
      urisWithoutFragments.add(MediaUri.removeFragment(uri))
    }

    const assets: Asset[] = []
    // Resolve the main media URIs
    while (urisWithoutFragments.size > 0) {
      const promises = []
      for (const uri of urisWithoutFragments) {
        promises.push(this.resolveSingle(uri, throwException))
        urisWithoutFragments.delete(uri)
      }
      for (const asset of await Promise.all<Asset | undefined>(promises)) {
        if (asset != null) {
          findMediaUris(asset.yaml, urisWithoutFragments)
          assets.push(asset)
          // In the set urisWithoutFragments can be both ref: and uuid: URIs.
          urisWithoutFragments.delete(asset.ref)
          urisWithoutFragments.delete(asset.uuid)
        }
      }
    }
    return assets
  }

  /**
   * Return a media asset.
   *
   * @param uri - A media URI in the `ref` or `uuid` scheme with or without a
   * sample fragment.
   *
   * @returns A media asset or undefined.
   */
  public getAsset (uri: string): Asset {
    const asset = this.assetCache.get(uri)
    if (asset == null) {
      throw new Error(`The asset with the URI ${uri} couldn’t be resolved.`)
    }
    return asset
  }

  /**
   * Return a media asset. If the asset has not yet been resolved, it will be
   * resolved.
   *
   * @param uri - A media URI in the `ref` or `uuid` scheme with or without a
   * sample fragment.
   *
   * @returns A media asset or undefined.
   */
  public async resolveAsset (uri: string): Promise<Asset | undefined> {
    const asset = this.assetCache.get(uri)
    if (asset != null) {
      return asset
    }

    const assets = await this.resolve(uri)
    if (assets.length === 1) {
      return assets[0]
    }
  }

  /**
   * @returns All previously resolved media assets.
   */
  public exportAssets (refs?: string | string[] | Set<string>): Asset[] {
    if (refs != null) {
      return this.assetCache.getMultiple(refs)
    }
    return this.assetCache.getAll()
  }

  /**
   * Return a sample.
   *
   * @param uri - A media URI in the `ref` or `uuid` scheme with or without a
   *   sample fragment. If the fragment is omitted, the “complete” sample is
   *   returned
   *
   * @returns A sample or undefined.
   */
  public getSample (uri: string): Sample {
    const mediaUri = new MediaUri(uri)
    if (mediaUri.fragment == null) {
      uri = uri + '#complete'
    }
    const sample = this.sampleCache.get(uri)
    if (sample == null) {
      throw new Error(`The sample with the URI ${uri} couldn’t be resolved.`)
    }
    return sample
  }

  /**
   * Return a sample. If the sample has not yet been resolved, it will be
   * resolved.
   *
   * @param uri - A media URI in the `ref` or `uuid` scheme with or without a
   *   sample fragment. If the fragment is omitted, the “complete” sample is
   *   returned
   *
   * @returns A sample or undefined.
   */
  public async resolveSample (uri: string): Promise<Sample | undefined> {
    const mediaUri = new MediaUri(uri)
    if (mediaUri.fragment == null) {
      uri = uri + '#complete'
    }
    const sample = this.sampleCache.get(uri)
    if (sample != null) {
      return sample
    }

    await this.resolve(uri)
    return this.sampleCache.get(uri)
  }

  /**
   * @returns All previously resolved samples.
   */
  public exportSamples (): Sample[] {
    return this.sampleCache.getAll()
  }

  /**
   * @param uri - A asset URI in various formats.
   *
   * @returns A asset URI (without the fragment) in the `ref` scheme.
   */
  translateToAssetRef (uri: string): string | undefined {
    return this.uriTranslator.getRef(uri, true)
  }

  /**
   * Reset all delegated caches.
   */
  reset (): void {
    this.sampleCache.reset()
    this.assetCache.reset()
    this.uriTranslator.reset()
    this.shortcutManager.reset()
  }
}

export async function updateMediaServer (): Promise<void> {
  await api.updateMediaServer()
}
