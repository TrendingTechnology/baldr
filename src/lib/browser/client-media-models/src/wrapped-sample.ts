/**
 * Wrap a sample with some custom meta data (mostly a custom title). Allow
 * different input specifications. Allow fuzzy specification of the samples.
 *
 * @module @bldr/wrapped-sample
 */

import { Sample } from './sample'
import { MediaUri } from './media-uri'
import { sampleCache } from './cache'

interface SimpleSampleSpec {
  uri: string
  title?: string
}

/**
 * This class holds the specification of the wrapped sample. The sample object
 * itself is not included in this class.
 */
class WrappedSampleSpec {
  /**
   * The URI of a sample.
   */
   uri: string

  /**
   * The manually set title.
   */
  readonly customTitle?: string

  /**
   * @param spec - Different input specifications are
   *   possible:
   *
   *   1. The sample URI as a string (for example: `ref:Fuer-Elise_HB`).
   *   2. The sample URI inside the title text. (for example
   *      `ref:Fuer-Elise_HB Für Elise` or `Für Elise ref:Fuer-Elise_HB`)
   *   3. An object with the mandatory property `uri` (for example:
   *      `{ uri: 'ref:Fuer-Elise_HB'}`).
   */
  constructor (spec: string | SimpleSampleSpec) {
    // string
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
        this.customTitle = title
      }
    // interface SimpleSampleSpec
    } else {
      const simpleSample = spec
      this.uri = simpleSample.uri
      if (simpleSample.title != null) {
        this.customTitle = simpleSample.title
      }
    }
  }
}

 export class WrappedSampleSpecList {

  specs: WrappedSampleSpec[]
  /**
   * @param spec - Different input specifications are
   *   possible:
   *
   *   1. The sample URI as a string (for example: `ref:Fuer-Elise_HB`).
   *   2. An object with the mandatory property `uri` (for example:
   *      `{ uri: 'ref:Fuer-Elise_HB'}`).
   *   3. An array
   */
  constructor (spec: string | SimpleSampleSpec | string[] | SimpleSampleSpec[]) {
    // Make sure we have an array.
    let specArray
    if (!Array.isArray(spec)) {
      specArray = [spec]
    } else {
      specArray = spec
    }

    this.specs = []
    for (const sampleSpec of specArray) {
      this.specs.push(new WrappedSampleSpec(sampleSpec))
    }
  }

  /**
   * Get the URI of all wrapped samples.
   */
  get uris (): string[] {
    const uris = []
    for (const spec of this.specs) {
      if (spec.uri != null) {
        uris.push(spec.uri)
      }
    }
    return uris
  }
}

/**
 * This class holds the resolve sample object.
 */
class WrappedSample {

  spec: WrappedSampleSpec

  private readonly sample: Sample

  constructor (spec: WrappedSampleSpec) {
    this.spec = spec
    const sample = sampleCache.get(this.spec.uri)

    if (sample != null) {
      this.sample = sample
    } else {
      throw new Error(`The sample with the URI “${this.spec.uri}” coudn’t be resolved.`)
    }
  }

  /**
   * The manually set custom title or, if not set, the `titleSafe` of the
   * `sample`.
   *
   * We have to use a getter, because the sample may not be resolved at the
   * constructor time.
   */
  get title (): string | undefined {
    if (this.spec.customTitle != null) return this.spec.customTitle
    if (this.sample.titleSafe != null) return this.sample.titleSafe
  }
}
