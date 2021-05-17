import { MediaUri } from '@bldr/client-media-models'

import { Sample, sampleShortcutManager, ClientMediaAsset, imageShortcutCounter } from './internal'

export class Cache <T> {
  protected cache: { [ref: string]: T }
  constructor () {
    this.cache = {}
  }

  add (ref: string, mediaObject: T): boolean {
    if (this.cache[ref] == null) {
      this.cache[ref] = mediaObject
      return true
    }
    return false
  }

  get (ref: string): T | undefined {
    if (this.cache[ref] != null) {
      return this.cache[ref]
    }
  }

  /**
   * The size of the cache. Indicates how many media objects are in the cache.
   */
  get size (): number {
    return Object.keys(this.cache).length
  }

  getAll (): T[] {
    return Object.values(this.cache)
  }

  reset (): void {
    for (const ref in this.cache) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete this.cache[ref]
    }
  }

  * [Symbol.iterator] (): Generator<T, any, any> {
    for (const ref in this.cache) {
      yield this.cache[ref]
    }
  }
}

/**
 * Media assets have two URI schemes: `uuid:` and `ref:`. Internally we use only
 * the `ref` scheme. This cache enables the translation from `uuid` to `ref`
 * URIs.
 */
export class MediaUriTranslator {
  private uuids: { [uuid: string]: string }

  constructor () {
    this.uuids = {}
  }

  /**
   *
   * @param ref The authority in the reference (`ref`) scheme. The prefixed
   *   scheme can be omitted.
   * @param uuid The authority in the Universally Unique Identifier (`uuid`)
   *   scheme. The prefixed scheme can be omitted.
   *
   * @returns True, if the uri authority pair was successfully added, false
   *   if the pair was already added.
   */
  addPair (ref: string, uuid: string): boolean {
    ref = MediaUri.removeScheme(ref)
    uuid = MediaUri.removeScheme(uuid)
    if (this.uuids[uuid] == null) {
      this.uuids[uuid] = ref
      return true
    }
    return false
  }

  /**
   * Get the reference authority from the Universally Unique Identifier (uuid)
   * authority. The input must be specified without the scheme prefixes and the
   * output is prefixed with the `ref:` scheme.
   *
   * @param uuid With out the scheme prefix.
   *
   * @returns The reference authority with `ref:`
   */
  private getRefFromUuid (uuid: string): string | undefined {
    uuid = MediaUri.removeScheme(uuid)
    if (this.uuids[uuid] != null) {
      return 'ref:' + this.uuids[uuid]
    }
  }

  /**
   * Get the fully qualified media URI using the reference `ref` scheme. A URI
   * specified with `uuid` is converted to the `ref` scheme. A fragment
   * `#fragment` can be specified.
   *
   * @param uuidOrRef Scheme prefix is required, for example `ref:Mozart` or
   * `uuid:…`
   *
   * @returns A fully qualified media URI using the reference `ref` scheme, for
   * example `ref:Alla-Turca#complete`
   */
  getRef (uuidOrRef: string, withoutFragment: boolean = false): string | undefined {
    let prefix: string | undefined
    const splittedUri = MediaUri.splitByFragment(uuidOrRef)
    if (splittedUri.prefix.indexOf('uuid:') === 0) {
      prefix = this.getRefFromUuid(splittedUri.prefix)
    } else {
      prefix = splittedUri.prefix
    }
    if (prefix != null) {
      if (splittedUri.fragment == null || withoutFragment) {
        return prefix
      } else {
        return `${prefix}#${splittedUri.fragment}`
      }
    }
  }

  reset (): void {
    for (const uuid in this.uuids) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete this.uuids[uuid]
    }
  }
}

export const mediaUriTranslator = new MediaUriTranslator()

/**
 * @param uri A asset URI in various formats.
 *
 * @returns A asset URI (without the fragment) in the `ref` scheme.
 */
export function translateToAssetRef (uri: string): string | undefined {
  return mediaUriTranslator.getRef(uri, true)
}

/**
 * for example: translates `ref:test` into `ref:test#complete` or
 * `uuid:88ad5df3-d7f9-4e9e-9522-e205f51eedb3` into `ref:test#complete`
 *
 * @param uri A asset or sample URI in various formats.
 *
 * @returns A sample URI in the `ref` scheme. A missing fragment is added with `#complete`.
 */
export function translateToSampleRef (uri: string): string | undefined {
  if (!uri.includes('#')) {
    uri = uri + '#complete'
  }
  return mediaUriTranslator.getRef(uri)
}

class SampleCache extends Cache<Sample> {}

export const sampleCache = new SampleCache()

export class AssetCache extends Cache<ClientMediaAsset> {
  add (ref: string, asset: ClientMediaAsset): boolean {
    if (mediaUriTranslator.addPair(asset.ref, asset.uuid)) {
      super.add(ref, asset)
      return true
    }
    return false
  }

  get (uuidOrRef: string): ClientMediaAsset | undefined {
    const id = mediaUriTranslator.getRef(uuidOrRef)
    if (id != null) {
      return super.get(id)
    }
  }
}

export const assetCache = new AssetCache()

export function resetMediaCache (): void {
  sampleCache.reset()
  assetCache.reset()
  mediaUriTranslator.reset()
  sampleShortcutManager.reset()
  imageShortcutCounter.reset()
}
