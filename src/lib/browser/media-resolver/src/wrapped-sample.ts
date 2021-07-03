/**
 * Wrap a sample with some custom meta data (mostly a custom title). Allow
 * different input specifications. Allow fuzzy specification of the samples.
 *
 * @module @bldr/wrapped-sample
 */

import type { MediaResolverTypes } from '@bldr/type-definitions'
import { MediaUri } from '@bldr/client-media-models'
import { sampleCache } from './internal'

interface SimpleSampleSpec {
  uri: string
  title?: string
}

/**
 * This class holds the specification of a wrapped sample. The sample object
 * itself is not included in this class.
 */
class WrappedSpec {
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

    if (!this.uri.includes('#')) {
      this.uri = this.uri + '#complete'
    }
  }
}

type WrappedSpecInput = string | SimpleSampleSpec | string[] | SimpleSampleSpec[]

/**
 * This class holds the specification of a list of wrapped samples. The sample
 * objects itself are not included in this class.
 */
export class WrappedSpecList {
  specs: WrappedSpec[]
  /**
   * @param spec - This input options are available:
   *
   *   1. The sample URI as a string (for example: `ref:Fuer-Elise_HB`).
   *   2. An object with the mandatory property `uri` (for example:
   *      `{ uri: 'ref:Fuer-Elise_HB' }`).
   *   3. An array
   */
  constructor (spec: WrappedSpecInput) {
    // Make sure we have an array.
    let specArray
    if (!Array.isArray(spec)) {
      specArray = [spec]
    } else {
      specArray = spec
    }

    this.specs = []
    for (const sampleSpec of specArray) {
      this.specs.push(new WrappedSpec(sampleSpec))
    }
  }

  /**
   * Get the URI of all wrapped samples.
   */
  get uris (): Set<string> {
    const uris = new Set<string>()
    for (const spec of this.specs) {
      uris.add(spec.uri)
    }
    return uris
  }

  * [Symbol.iterator] (): Generator<WrappedSpec, any, any> {
    for (const spec of this.specs) {
      yield spec
    }
  }
}

/**
 * This class holds the resolve sample object.
 */
export class WrappedSample {
  private readonly spec: WrappedSpec

  private readonly sample: MediaResolverTypes.Sample

  constructor (spec: WrappedSpec) {
    this.spec = spec
    const sample = sampleCache.get(this.spec.uri)
    if (sample == null) {
      throw new Error(`The sample “${this.spec.uri}” couldn’t be loaded.`)
    }
    this.sample = sample
  }

  /**
   * The manually set custom title or, if not set, the `titleSafe` of the
   * `sample`.
   *
   * We have to use a getter, because the sample may not be resolved at the
   * constructor time.
   */
  get titleSafe (): string | undefined {
    if (this.spec.customTitle != null) {
      return this.spec.customTitle
    }
    if (this.sample.titleSafe != null) {
      return this.sample.titleSafe
    }
  }

  getSample (): MediaResolverTypes.Sample {
    return this.sample
  }

  getAsset (): MediaResolverTypes.ClientMediaAsset {
    return this.getSample().asset
  }
}

export class WrappedSampleList {
  private readonly samples: WrappedSample[]
  constructor (specs: WrappedSpecInput) {
    this.samples = []
    for (const spec of new WrappedSpecList(specs)) {
      this.samples.push(new WrappedSample(spec))
    }
  }

  * [Symbol.iterator] (): Generator<WrappedSample, any, any> {
    for (const sample of this.samples) {
      yield sample
    }
  }

  /**
   * If the wrapped sample list has only one sample in the list and the samples
   * of the first included asset are more than one, than return this sample
   * collection.
   */
  getSamplesFromFirst (): MediaResolverTypes.SampleCollection | undefined {
    if (this.samples.length === 1) {
      const sample = this.samples[0]
      const asset = sample.getAsset()
      if (asset.samples != null) {
        const samples = asset.samples
        if (samples.size > 1) {
          return samples
        }
      }
    }
  }
}

export function getUrisFromWrappedSpecs (spec: WrappedSpecInput): Set<string> {
  return new WrappedSpecList(spec).uris
}

export function getWrappedSampleList (spec: WrappedSpecInput): WrappedSampleList {
  return new WrappedSampleList(spec)
}
