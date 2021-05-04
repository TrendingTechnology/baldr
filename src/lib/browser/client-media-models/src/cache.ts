import { Sample, shortcutManager } from './sample'
import { ClientMediaAsset } from './asset'

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
 * Media assets have two URIs: uuid:... and ref:...
 */
export class MediaUriCache {
  private refs: { [ref: string]: string }
  private uuids: { [uiid: string]: string }

  constructor () {
    this.refs = {}
    this.uuids = {}
  }

  addPair (ref: string, uuid: string): boolean {
    if (this.refs[ref] == null && this.uuids[uuid] == null) {
      this.refs[ref] = uuid
      this.uuids[uuid] = ref
      return true
    }
    return false
  }

  private getRefFromUuid (uuid: string): string | undefined {
    if (this.uuids[uuid] != null) {
      return this.uuids[uuid]
    }
  }

  getRef (uuidOrRef: string): string | undefined {
    if (uuidOrRef.indexOf('uuid:') === 0) {
      return this.getRefFromUuid(uuidOrRef)
    }
    return uuidOrRef
  }

  reset (): void {
    for (const ref in this.refs) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete this.refs[ref]
    }
    for (const uuid in this.uuids) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete this.uuids[uuid]
    }
  }
}

export const mediaUriCache = new MediaUriCache()

class SampleCache extends Cache<Sample> {}

export const sampleCache = new SampleCache()

export class AssetCache extends Cache<ClientMediaAsset> {
  add (ref: string, asset: ClientMediaAsset): boolean {
    if (mediaUriCache.addPair(asset.ref, asset.uuid)) {
      super.add(ref, asset)
      return true
    }
    return false
  }

  get (uuidOrRef: string): ClientMediaAsset | undefined {
    const id = mediaUriCache.getRef(uuidOrRef)
    if (id != null) {
      return super.get(id)
    }
  }
}

export const assetCache = new AssetCache()

export function resetMediaCache (): void {
  sampleCache.reset()
  assetCache.reset()
  mediaUriCache.reset()
  shortcutManager.reset()
}
