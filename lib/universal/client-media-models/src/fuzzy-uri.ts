/**
 * @file
 * Wrap a media asset or a sample URI with a title in an object. Allow fuzzy
 * specification of the URIs.
 */

import { MediaUri } from './media-uri'
export type FuzzyUriInput = string | WrappedUri | string[] | WrappedUri[]

export interface WrappedUri {
  uri: string
  title?: string
}

class WrappedUriCollector implements WrappedUri {
  uri: string

  title?: string

  constructor (spec: string | WrappedUri) {
    if (typeof spec === 'string') {
      const match = spec.match(MediaUri.regExp)
      if (match != null) {
        this.uri = match[0]
      } else {
        throw new Error(`No media URI found in “${spec}”!`)
      }
      let title = spec.replace(MediaUri.regExp, '')
      if (title != null && title !== '') {
        title = title.trim()
        title = title.replace(/\s{2,}/g, ' ')
        if (title !== '.' && title !== 'none') {
          this.title = title
        }
      }
    } else {
      if (spec.uri == null) {
        throw new Error(`No media URI found in “${JSON.stringify(spec)}”!`)
      }
      this.uri = spec.uri
      if (spec.title != null) {
        this.title = spec.title
      }
    }
  }
}

/**
 * This class holds a list of wrapped URIs.
 */
export class WrappedUriList {
  public list: WrappedUri[]

  constructor (spec: FuzzyUriInput) {
    let specArray
    if (!Array.isArray(spec)) {
      specArray = [spec]
    } else {
      specArray = spec
    }

    this.list = []
    for (const sampleSpec of specArray) {
      this.list.push(new WrappedUriCollector(sampleSpec))
    }
  }

  /**
   * Get all URIs (without the sample fragment).
   */
  get uris (): Set<string> {
    const uris = new Set<string>()
    for (const spec of this.list) {
      uris.add(MediaUri.removeFragment(spec.uri))
    }
    return uris
  }

  /**
   * The first wrapped media URI in the list.
   */
  get first (): WrappedUri | undefined {
    if (this.list.length > 0) {
      return this.list[0]
    }
  }

  /**
   * A number that indicates how many elements are in the list.
   */
  get size (): number {
    return this.list.length
  }

  * [Symbol.iterator] (): Generator<WrappedUri, any, any> {
    for (const spec of this.list) {
      yield spec
    }
  }
}

export function extractUrisFromFuzzySpecs (spec: FuzzyUriInput): Set<string> {
  return new WrappedUriList(spec).uris
}
