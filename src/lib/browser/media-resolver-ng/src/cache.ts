import * as Types from './types'
import { MediaUri } from '@bldr/client-media-models'

/**
 * This class manages the counter for one MIME type (`audio`, `image` and `video`).
 */
class MimeTypeShortcutCounter {
  /**
   * `a` for audio files and `v` for video files.
   */
  private readonly triggerKey: string

  private count: number

  constructor (triggerKey: string) {
    this.triggerKey = triggerKey
    this.count = 0
  }

  /**
   * Get the next available shortcut: `a 1`, `a 2`
   */
  get (): string | undefined {
    if (this.count < 10) {
      this.count++
      if (this.count === 10) {
        return `${this.triggerKey} 0`
      }
      return `${this.triggerKey} ${this.count}`
    }
  }

  reset (): void {
    this.count = 0
  }
}

export class Cache<T> implements Types.Cache<T> {
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
export class UriTranslator {
  private uuids: { [uuid: string]: string }

  constructor () {
    this.uuids = {}
  }

  /**
   * @param ref - The authority in the reference (`ref`) scheme. The prefixed
   *   scheme can be omitted.
   * @param uuid - The authority in the Universally Unique Identifier (`uuid`)
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
  getRef (
    uuidOrRef: string,
    withoutFragment: boolean = false
  ): string | undefined {
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
