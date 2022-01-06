export interface Cache<T> {
  add: (ref: string, mediaObject: T) => boolean

  get: (ref: string) => T | undefined
  /**
   * The size of the cache. Indicates how many media objects are in the cache.
   */
  size: number

  getAll: () => T[]

  reset: () => void
}
