/**
 * @file
 * Wrap a media asset or a sample URI with a title in an object. Allow fuzzy
 * specification of the URIs.
 */

import { MediaUri } from '@bldr/client-media-models'

type FuzzySpec = string | WrappedUri | string[] | WrappedUri[]

interface WrappedUri {
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
  specs: WrappedUri[]

  constructor (spec: FuzzySpec) {
    let specArray
    if (!Array.isArray(spec)) {
      specArray = [spec]
    } else {
      specArray = spec
    }

    this.specs = []
    for (const sampleSpec of specArray) {
      this.specs.push(new WrappedUriCollector(sampleSpec))
    }
  }

  /**
   * Get all URIs.
   */
  get uris (): Set<string> {
    const uris = new Set<string>()
    for (const spec of this.specs) {
      uris.add(spec.uri)
    }
    return uris
  }

  * [Symbol.iterator] (): Generator<WrappedUri, any, any> {
    for (const spec of this.specs) {
      yield spec
    }
  }
}

export function extractUrisFromFuzzySpecs (spec: FuzzySpec): Set<string> {
  return new WrappedUriList(spec).uris
}
