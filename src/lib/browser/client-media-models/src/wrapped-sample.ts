import { Sample } from './sample'
import { MediaUri } from './media-uri'

interface SimpleSampleSpec {
  uri: string
  title?: string
}

/**
 * Wrap a sample with some custom meta data (mostly a custom title). Allow
 * different input specifications.
 *
 * @see {@link module:@bldr/media-client.WrappedSampleList}
 * @see {@link module:@bldr/lamp/content-file~AudioOverlay}
 */
class WrappedSample {
  /**
   * The URI of a sample.
   */
   uri?: string

  private readonly sample?: Sample

  /**
   * The manually set title.
   */
  private readonly customTitle?: string

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
      if (spec.match(MediaUri.regExp) != null) {
        const match = spec.match(MediaUri.regExp)
        if (match != null) { this.uri = match[0] }
        let title = spec.replace(MediaUri.regExp, '')
        if (title != null) {
          title = title.trim()
          this.customTitle = title
        }
      } else {
        throw new Error(`No media URI found in “${spec}”!`)
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

  /**
   * The manually set custom title or, if not set, the `titleSafe` of the
   * `sample`.
   *
   * We have to use a getter, because the sample may not be resolved at the
   * constructor time.
   */
  get title (): string | undefined {
    if (this.customTitle != null) return this.customTitle
    if (this.sample?.titleSafe != null) return this.sample.titleSafe
  }
}

/**
 * Wrap some samples with metadata. Allow fuzzy specification of the samples.
 * Normalize the input.
 */
export class WrappedSampleList {

  samples: WrappedSample[]
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

    this.samples = []
    for (const sampleSpec of specArray) {
      this.samples.push(new WrappedSample(sampleSpec))
    }
  }

  /**
   * Get the URI of all wrapped samples.
   */
  get uris (): string[] {
    const uris = []
    for (const wrappedSample of this.samples) {
      if (wrappedSample.uri != null) {
        uris.push(wrappedSample.uri)
      }
    }
    return uris
  }
}
