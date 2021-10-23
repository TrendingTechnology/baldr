import { MediaResolverTypes } from '@bldr/type-definitions'

import { makeHttpRequestInstance } from '@bldr/http-request'
import { makeSet } from '@bldr/core-browser'
import { MediaUri, findMediaUris } from '@bldr/client-media-models'
import config from '@bldr/config'

import { ClientMediaAsset, AssetCache } from './asset'
import { MediaUriTranslator } from './cache'

type UrisSpec = string | string[] | Set<string>

/**
 * Resolve (get the HTTP URL and some meta informations) of a remote media
 * file by its URI. Create media elements for each media file. Create samples
 * for playable media files.
 */
export class Resolver {
  httpRequest = makeHttpRequestInstance(config, 'automatic', '/api/media')
  assetCache: AssetCache
  uriTranslator: MediaUriTranslator

  /**
   * Assets with linked assets have to be cached. For example: many
   * audio assets can have the same cover ID.
   */
  private cache: { [uri: string]: MediaResolverTypes.RestApiRaw }

  constructor () {
    this.cache = {}
    this.uriTranslator = new MediaUriTranslator()
    this.assetCache = new AssetCache(this.uriTranslator)
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
  ): Promise<MediaResolverTypes.RestApiRaw | undefined> {
    const mediaUri = new MediaUri(uri)
    const field = mediaUri.scheme
    const search = mediaUri.authority
    const cacheKey = mediaUri.uriWithoutFragment
    if (this.cache[cacheKey] != null) {
      return this.cache[cacheKey]
    }
    const response = await this.httpRequest.request({
      url: 'query',
      method: 'get',
      params: {
        type: 'assets',
        method: 'exactMatch',
        field: field,
        search: search
      }
    })
    if (response == null || response.status !== 200 || response.data == null) {
      if (throwException) {
        throw new Error(
          `Media with the ${field} ”${search}” couldn’t be resolved.`
        )
      }
    } else {
      const rawRestApiAsset: MediaResolverTypes.RestApiRaw = response.data
      this.cache[cacheKey] = rawRestApiAsset
      return rawRestApiAsset
    }
  }

  /**
   * Resolve (get the HTTP URL and some meta informations) of a remote media
   * file by its URI.
   *
   * @param uri A media URI (Uniform Resource Identifier) with an optional
   *   fragment suffix, for example `ref:Yesterday#complete`. The fragment
   *   suffix is removed.
   * @param throwException - Throw an exception if the media URI
   *  cannot be resolved (default: `true`).
   */
  private async resolveSingle (
    uri: string,
    throwException: boolean = true
  ): Promise<MediaResolverTypes.ClientMediaAsset | undefined> {
    const cachedAsset = this.assetCache.get(uri)
    if (cachedAsset != null) {
      return cachedAsset
    }
    const raw = await this.queryMediaServer(uri, throwException)
    if (raw != null) {
      const httpUrl = `${this.httpRequest.baseUrl}/${config.mediaServer.urlFillIn}/${raw.path}`
      return new ClientMediaAsset(uri, httpUrl, raw)
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
  async resolve (
    uris: UrisSpec,
    throwException: boolean = true
  ): Promise<MediaResolverTypes.ClientMediaAsset[]> {
    const mediaUris = makeSet(uris)
    const urisWithoutFragments = new Set<string>()
    for (const uri of mediaUris) {
      urisWithoutFragments.add(MediaUri.removeFragment(uri))
    }

    const assets: MediaResolverTypes.ClientMediaAsset[] = []
    // Resolve the main media URIs
    while (urisWithoutFragments.size > 0) {
      const promises = []
      for (const uri of urisWithoutFragments) {
        promises.push(this.resolveSingle(uri, throwException))
        urisWithoutFragments.delete(uri)
      }
      for (const asset of await Promise.all<
      MediaResolverTypes.ClientMediaAsset | undefined
      >(promises)) {
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
}
