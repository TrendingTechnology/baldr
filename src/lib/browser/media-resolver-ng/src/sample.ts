import { MediaResolverTypes } from '@bldr/type-definitions'

import { convertDurationToSeconds } from '@bldr/core-browser'

/**
 * A sample (snippet, sprite) of a media file which can be played. A sample
 * has typically a start time and a duration. If the start time is missing, the
 * media file gets played from the beginning. If the duration is missing, the
 * whole media file gets played.
 *
 * ```
 *                  currentTimeSec
 *                  |
 *  fadeIn          |        fadeOut
 *         /|-------+------|\           <- mediaElementCurrentVolume_
 *      /   |       |      |   \
 *   /      |       |      |     \
 * #|#######|#######|######|#####|#### <- mediaElement
 *  ^                            ^
 *  startTimeSec                 endTimeSec
 *                         ^
 *                         |
 *                         fadeOutStartTime
 *
 *  | <-      durationSec      ->|
 * ```
 */
export interface SampleSpec {
  /**
   * The parent media file object.
   *
   */
  asset: MediaResolverTypes.ClientMediaAsset

  /**
   * Raw data coming from the YAML format.
   */
  yaml: MediaResolverTypes.SampleYamlFormat

  /**
   * The start time in seconds. The sample is played from this start time
   * using the `mediaElement` of the `asset`. It is the “zero” second
   * for the sample.
   */
  startTimeSec: number

  /**
   * The shortcut key stroke combination to launch the sample for example `a 1`, `v 1` or `i 1`.
   */
  shortcut?: string

  /**
   * The reference of the sample. The reference is used to build the URI of the sample, for
   * example `uri#reference`: `ref:Beethoven#complete`
   */
  ref: string

  /**
   * The title of the sample. For example `komplett`, `Hook-Line`.
   */
  title: string

  /**
   * If the sample is the complete media file get the title of the media file.
   * For example `Glocken (Das große Tor von Kiew)`
   */
  titleSafe: string

  /**
   * Combined value build from `this.asset.meta.artist` and `this.asset.meta.composer`.
   */
  artistSafe?: string

  /**
   * Combined value build from `this.asset.yaml.creationDate` and
   * `this.asset.yaml.year`.
   */
  yearSafe?: string

  /**
   * Time in seconds to fade in.
   */
  fadeInSec: number

  /**
   * Time in seconds to fade out.
   */
  fadeOutSec: number
}

/**
 * We fade in very short and smoothly to avoid audio artefacts.
 */
const defaultFadeInSec: number = 0.3

/**
  * We never stop. Instead we fade out very short and smoothly.
  */
const defaultFadeOutSec: number = 1

export class Sample implements SampleSpec {
  asset: MediaResolverTypes.ClientMediaAsset
  yaml: MediaResolverTypes.SampleYamlFormat

  startTimeSec: number = 0

  /**
   * Use the getter function `sample.fadeInSec`
   */
  private readonly fadeInSec_?: number

  /**
   * Use the getter function `sample.fadeOutSec`
   */
  private readonly fadeOutSec_?: number

  shortcut?: string

  constructor (
    asset: MediaResolverTypes.ClientMediaAsset,
    yaml: MediaResolverTypes.SampleYamlFormat
  ) {
    this.asset = asset

    this.yaml = yaml

    if (this.yaml.ref == null) {
      this.yaml.ref = 'complete'
    }

    if (this.yaml.startTime != null) {
      this.startTimeSec = this.toSec(this.yaml.startTime)
    }

    if (this.yaml.duration != null && this.yaml.endTime != null) {
      throw new Error(
        'Specifiy duration or endTime not both. They are mutually exclusive.'
      )
    }

    if (this.yaml.fadeIn != null) {
      this.fadeInSec_ = this.toSec(this.yaml.fadeIn)
    }

    if (this.yaml.fadeOut != null) {
      this.fadeOutSec_ = this.toSec(this.yaml.fadeOut)
    }

    this.shortcut = this.yaml.shortcut
  }

  /**
   * Convert strings to numbers, so we can use them as seconds.
   */
  private toSec (timeIntervaleString: string | number): number {
    return convertDurationToSeconds(timeIntervaleString)
  }

  get ref (): string {
    const ref = this.yaml.ref == null ? 'complete' : this.yaml.ref
    return `${this.asset.ref}#${ref}`
  }

  get title (): string {
    if (this.yaml.title != null) {
      return this.yaml.title
    }
    if (this.yaml.ref != null && this.yaml.ref !== 'complete') {
      return this.yaml.ref
    }
    return 'komplett'
  }

  get titleSafe (): string {
    if (this.yaml.ref === 'complete') {
      return this.asset.titleSafe
    } else {
      return `${this.title} (${this.asset.titleSafe})`
    }
  }

  get artistSafe (): string | undefined {
    let artist: string | null = null
    let composer: string | null = null
    if (this.asset.yaml.artist != null) {
      artist = `<em class="person">${this.asset.yaml.artist}</em>`
    }
    if (this.asset.yaml.composer != null) {
      composer = `<em class="person">${this.asset.yaml.composer}</em>`
    }
    if (artist != null && composer != null) {
      return `${composer} (${artist})`
    } else if (artist != null && composer == null) {
      return artist
    } else if (artist == null && composer != null) {
      return composer
    }
  }

  get yearSafe (): string | undefined {
    if (this.asset.yaml.creationDate != null) {
      return this.asset.yaml.creationDate
    } else if (this.asset.yaml.year != null) {
      return this.asset.yaml.year
    }
  }

  get fadeInSec (): number {
    if (this.fadeInSec_ == null) {
      return defaultFadeInSec
    } else {
      return this.fadeInSec_
    }
  }

  get fadeOutSec (): number {
    if (this.fadeOutSec_ == null) {
      return defaultFadeOutSec
    } else {
      return this.fadeOutSec_
    }
  }
}
