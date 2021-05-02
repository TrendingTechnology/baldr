import { Sample } from './sample'
import { MediaUri } from './media-uri'
/**
 * Wrap a sample with some meta data (mostly a custom title). Allow different
 * input specifications.
 *
 * @see {@link module:@bldr/media-client.WrappedSampleList}
 * @see {@link module:@bldr/lamp/content-file~AudioOverlay}
 */
class WrappedSample {
  private sample_?: Sample

  /**
   * The manually set title.
   */
  private title_?: string

  /**
   * True if the title is set manually.
   *
   * This specification sets the property to `true`.
   * `{ title: 'My Title', uri: 'ref:Fuer-Elise' }`
   */
  isTitleSetManually: boolean = false

  /**
   * The URI of a sample.
   */
  uri: string
  /**
   * @param {Object|String} spec - Different input specifications are
   *   possible:
   *
   *   1. The sample URI as a string (for example: `ref:Fuer-Elise_HB`).
   *   2. The sample URI inside the title text. (for example
   *      `ref:Fuer-Elise_HB Für Elise` or `Für Elise ref:Fuer-Elise_HB`)
   *   3. An object with the mandatory property `uri` (for example:
   *      `{ uri: 'ref:Fuer-Elise_HB'}`).
   *   4. An instance of the class `Sample`.
   */
  constructor (spec: string | Sample | { [prop: string]: string }) {
    this.isTitleSetManually = false

    if (typeof spec === 'string') {
      if (spec.match(MediaUri.regExp) != null) {

        const match = spec.match(MediaUri.regExp)
        if (match != null)
          this.uri = match[0]

        let title = spec.replace(MediaUri.regExp, '')
        if (title) {
          title = title.trim()
          this.title_ = title
          this.isTitleSetManually = true
        }
      } else {
        throw new Error(`No media URI found in “${spec}”!`)
      }
    } else if (typeof spec === 'object' && spec.uri != null && !spec.sample) {
      this.uri = spec.uri
    } else if (spec.constructor.name === 'Sample') {
      this.uri = spec.uri
      this.sample_ = spec
    }

    if (spec.title) {
      this.isTitleSetManually = true
      this.title_ = spec.title
    }
  }

  /**
   * The manually set title or, if not set, the `title` of the `sample`.
   *
   * We have to use a getter, because the sample may not be resolved at
   * the constructor time.
   *
   * @returns {String}
   */
  get title () {
    if (this.title_) return this.title_
    if (this.sample && this.sample.title) return this.sample.title
  }

  /**
   * The manually set title or, if not set, the `titleSafe` of the `sample`.
   *
   * We have to use a getter, because the sample may not be resolved at
   * the constructor time.
   *
   * @returns {String}
   */
  get titleSafe () {
    if (this.title_) return this.title_
    if (this.sample && this.sample.titleSafe) return this.sample.titleSafe
  }

  /**
   * We have to use a getter, because the sample may not be resolved at
   * the constructor time.
   *
   * @returns {module:@bldr/media-client~Sample}
   */
  get sample () {
    if (this.sample_) return this.sample_
    return store.getters['media/sampleByUri'](this.uri)
  }
}

/**
 * Wrap some samples with metadata. Allow fuzzy specification of the samples.
 * Normalize the input.
 *
 * @see {@link module:@bldr/media-client~WrappedSample}
 * @see {@link module:@bldr/lamp/content-file~AudioOverlay}
 */
export class WrappedSampleList {
  /**
   * @param {Object|String|Array} spec - Different input specifications are
   *   possible:
   *
   *   1. The sample URI as a string (for example: `ref:Fuer-Elise_HB`).
   *   2. An object with the mandatory property `uri` (for example:
   *      `{ uri: 'ref:Fuer-Elise_HB'}`).
   *   3. An instance of the class `Sample`.
   *   4. An array
   */
  constructor (spec) {
    // Make sure we have an array.
    let specArray
    if (!Array.isArray(spec)) {
      specArray = [spec]
    } else {
      specArray = spec
    }

    /**
     * An array of instances of the class `WrappedSample`
     * @type {Array}
     */
    this.samples = []
    for (const sampleSpec of specArray) {
      this.samples.push(new WrappedSample(sampleSpec))
    }

    /**
     * True if the title of the first sample is set manually.
     *
     * This specification sets the property to `true`.
     * `{ title: 'My Title', uri: 'ref:Fuer-Elise' }`
     *
     * @type {Boolean}
     */
    this.isTitleSetManually = false
    if (this.samples[0].isTitleSetManually) {
      this.isTitleSetManually = true
    }
  }

  /**
   * Get the URI of all wrapped samples.
   *
   * @returns {Array}
   */
  get uris () {
    const uris = []
    for (const wrappedSample of this.samples) {
      uris.push(wrappedSample.uri)
    }
    return uris
  }
}
