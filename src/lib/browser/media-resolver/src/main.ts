import { makeHttpRequestInstance } from '@bldr/http-request'
import { ClientMediaAsset, MediaUri, findMediaUris, AssetCache } from '@bldr/client-media-models'
import { makeSet } from '@bldr/core-browser'
import config from '@bldr/config'
import type { AssetType } from '@bldr/type-definitions'
export const httpRequest = makeHttpRequestInstance(config, 'automatic', '/api/media')

export const assetCache = new AssetCache()

/**
 * Resolve (get the HTTP URL and some meta informations) of a remote media
 * file by its URI. Resolve a local file. The local files have to dropped
 * in the application. Create media elements for each media file. Create samples
 * for playable media files.
 */
export class Resolver {
  /**
   * Assets with linked assets have to be cached. For example: many
   * audio assets can have the same cover ID.
   */
  private cache: { [uri: string]: AssetType.RestApiRaw }

  constructor () {
    this.cache = {}
  }

  /**
   * @param field - For example `id` or `uuid`
   * @param search - For example `Fuer-Elise_HB`
   * @param throwException - Throw an exception if the media URI
   *  cannot be resolved (default: `true`).
   *
   * @returns {Object} - See {@link https://github.com/axios/axios#response-schema}
   */
  private async queryMediaServer (uri: string): Promise<AssetType.RestApiRaw> {
    const mediaUri = new MediaUri(uri)
    const field = mediaUri.scheme
    const search = mediaUri.authority
    const cacheKey = mediaUri.uriWithoutFragment
    if (this.cache[cacheKey] != null) {
      return this.cache[cacheKey]
    }
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
    if (response == null || response.status !== 200 || response.data == null) {
      throw new Error(`Media with the ${field} ”${search}” couldn’t be resolved.`)
    }
    const rawRestApiAsset: AssetType.RestApiRaw = response.data
    this.cache[cacheKey] = rawRestApiAsset
    return rawRestApiAsset
  }

  /**
   * @private
   *
   * @param {String} uri - For example `uuid:... id:...`
   * @param {Object} data - Object from the REST API.
   *
   * @returns {module:@bldr/media-client.ClientMediaAsset}
   */
  // createAssetFromRestData_ (uri, data): ClientMediaAsset {
  //   let asset
  //   data.uri = uri
  //   if (data.multiPartCount) {
  //     // asset = new MultiPartAsset({ uri })
  //     // store.commit('media/addMultiPartUri', asset.uriRaw)
  //   } else {
  //     asset = new ClientMediaAsset({ uri })
  //     console.log(new ClientMediaAsset(data))
  //   }
  //   extractMediaUrisRecursive(data, this.linkedUris)
  //   asset.addProperties(data)
  //   asset.httpUrl = this.resolveHttpUrl_(asset)
  //   if (asset.previewImage) {
  //     asset.previewHttpUrl = `${asset.httpUrl}_preview.jpg`
  //   }
  //   return asset
  // }

  /**
   * @private
   *
   * @param {Object} file - A file object, see
   *  {@link https://developer.mozilla.org/de/docs/Web/API/File}
   *
   * @returns {module:@bldr/media-client.ClientMediaAsset}
   */
  // createAssetFromFileObject_ (file) {
  //   if (mimeTypeManager.isAsset(file.name)) {
  //     // blob:http:/localhost:8080/8c00d9e3-6ff1-4982-a624-55f125b5c0c0
  //     const httpUrl = URL.createObjectURL(file)
  //     // 8c00d9e3-6ff1-4982-a624-55f125b5c0c0
  //     const uuid = httpUrl.substr(httpUrl.length - 36)
  //     // We use the uuid instead of the file name. The file name can contain
  //     // whitespaces and special characters. A uuid is  more reliable.
  //     const uri = `localfile:${uuid}`
  //     return new ClientMediaAsset({
  //       uri: uri,
  //       httpUrl: httpUrl,
  //       filename: file.name
  //     })
  //   }
  // }

  /**
   * @param {module:@bldr/media-client.ClientMediaAsset} asset
   */
  // addMediaElementToAsset (asset) {
  //   asset.type = mimeTypeManager.extensionToType(asset.extension)
  //   // After type
  //   if (asset.type !== 'document') {
  //     asset.mediaElement = createMediaElement(asset)
  //   }
  //   const samples = this.createSamples_(asset)
  //   if (samples) {
  //     asset.samples = samples
  //   }
  // }

  /**
   * Resolve (get the HTTP URL and some meta informations) of a remote media
   * file by its URI.
   */
  private async resolveSingle (uri: string): Promise<ClientMediaAsset> {
    const cachedAsset = assetCache.get(uri)
    if (cachedAsset != null) return cachedAsset
    const raw = await this.queryMediaServer(uri)
    const httpUrl = `${httpRequest.baseUrl}/${config.mediaServer.urlFillIn}/${raw.path}`
    const asset = new ClientMediaAsset(uri, httpUrl, raw)
    assetCache.add(asset)
    return asset
  }

  /**
   * Resolve one or more remote media files by URIs.
   *
   * Linked media URIs are resolved recursively.
   *
   * @param uris - A single media URI or an array of media URIs.
   */
  async resolve (uris: string | string[] | Set<string>): Promise<ClientMediaAsset[]> {
    const mediaUris = makeSet(uris)
    const assets: ClientMediaAsset[] = []
    // Resolve the main media URIs
    while (mediaUris.size > 0) {
      const promises = []
      for (const mediaUri of mediaUris) {
        promises.push(this.resolveSingle(mediaUri))
      }
      for (const asset of await Promise.all<ClientMediaAsset>(promises)) {
        findMediaUris(asset.meta, mediaUris)
        assets.push(asset)
        mediaUris.delete(asset.uri.raw)
      }
    }
    return assets
  }
}
