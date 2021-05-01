import { shortcutManager } from './sample'
import { ClientMediaAsset } from './asset'

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

export class AssetCache {
  private cache: { [ref: string]: ClientMediaAsset }

  private readonly mediaUriCache: MediaUriCache

  constructor () {
    this.cache = {}
    this.mediaUriCache = new MediaUriCache()
  }

  add (asset: ClientMediaAsset): boolean {
    if (this.mediaUriCache.addPair(asset.ref, asset.uuid)) {
      this.cache[asset.ref] = asset
      return true
    }
    return false
  }

  get (uuidOrRef: string): ClientMediaAsset | undefined {
    const id = this.mediaUriCache.getRef(uuidOrRef)
    if (id != null && this.cache[id] != null) {
      return this.cache[id]
    }
  }

  getAll (): ClientMediaAsset[] {
    return Object.values(this.cache)
  }

  reset (): void {
    for (const ref in this.cache) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete this.cache[ref]
    }
  }
}

export const assetCache = new AssetCache()

export function resetMediaCache (): void {
  assetCache.reset()
  shortcutManager.reset()
}
