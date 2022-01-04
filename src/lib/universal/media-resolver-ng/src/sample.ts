import { convertDurationToSeconds } from '@bldr/string-format'

import { Asset } from './asset'
import { SampleYamlFormat } from './types'

/**
 * We fade in very short and smoothly to avoid audio artefacts.
 */
const defaultFadeInSec: number = 0.3

/**
 * We never stop. Instead we fade out very short and smoothly.
 */
const defaultFadeOutSec: number = 1

/**
 * A sample (snippet, sprite) of a media asset which can be played. A sample
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
export class Sample {
  /**
   * The parent media asset.
   */
  public asset: Asset

  /**
   * Raw data coming from the YAML format.
   */
  yaml: SampleYamlFormat

  /**
   * The shortcut key stroke combination to launch the sample for example `a 1`, `v 1` or `i 1`.
   */
  public shortcut?: string

  /**
   * The duration of the sample in seconds.
   */
  public durationSec?: number

  /**
   * The start time in seconds. The sample is played from this start time
   * using the `mediaElement` of the `asset`. It is the “zero” second
   * for the sample.
   */
  public startTimeSec: number = 0

  /**
   * Time in seconds to fade in.
   */
  public readonly fadeInSec: number

  /**
   * Time in seconds to fade out.
   */
  public readonly fadeOutSec: number

  constructor (asset: Asset, yaml: SampleYamlFormat) {
    this.asset = asset

    this.yaml = yaml

    if (this.yaml.ref == null) {
      this.yaml.ref = 'complete'
    }

    if (this.yaml.startTime != null) {
      this.startTimeSec = this.convertToSeconds(this.yaml.startTime)
    }

    if (this.yaml.duration != null && this.yaml.endTime != null) {
      throw new Error(
        'Specifiy duration or endTime not both. They are mutually exclusive.'
      )
    }

    if (this.yaml.duration != null) {
      this.durationSec = this.convertToSeconds(this.yaml.duration)
    } else if (this.yaml.endTime != null) {
      this.durationSec =
        this.convertToSeconds(this.yaml.endTime) - this.startTimeSec
    }

    if (this.yaml.fadeIn != null) {
      this.fadeInSec = this.convertToSeconds(this.yaml.fadeIn)
    } else {
      this.fadeInSec = defaultFadeInSec
    }

    if (this.yaml.fadeOut != null) {
      this.fadeOutSec = this.convertToSeconds(this.yaml.fadeOut)
    } else {
      this.fadeOutSec = defaultFadeOutSec
    }

    this.shortcut = this.yaml.shortcut
  }

  /**
   * Convert strings to numbers, so we can use them as seconds.
   */
  private convertToSeconds (timeIntervaleString: string | number): number {
    return convertDurationToSeconds(timeIntervaleString)
  }

  /**
   * The sample reference is prefixed with `ref:` and suffixed with a sample
   * fragment (`#fragment`), for example `ref:Fuer-Elise#complete`.
   */
  public get ref (): string {
    const ref = this.yaml.ref == null ? 'complete' : this.yaml.ref
    return `${this.asset.ref}#${ref}`
  }

  /**
   * The title of the sample. For example `komplett`, `Hook-Line`.
   */
  public get title (): string {
    if (this.yaml.title != null) {
      return this.yaml.title
    }
    if (this.yaml.ref != null && this.yaml.ref !== 'complete') {
      return this.yaml.ref
    }
    return 'komplett'
  }

  /**
   * If the sample is the complete media file get the title of the media file.
   * For example `Glocken (Das große Tor von Kiew)`
   */
  public get titleSafe (): string {
    if (this.yaml.ref === 'complete') {
      return this.asset.titleSafe
    } else {
      return `${this.title} (${this.asset.titleSafe})`
    }
  }

  /**
   * Combined value build from `this.asset.meta.artist` and `this.asset.meta.composer`.
   */
  public get artistSafe (): string | undefined {
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

  /**
   * Combined value build from `this.asset.yaml.creationDate` and
   * `this.asset.yaml.year`.
   */
  public get yearSafe (): string | undefined {
    if (this.asset.yaml.creationDate != null) {
      return this.asset.yaml.creationDate
    } else if (this.asset.yaml.year != null) {
      return this.asset.yaml.year
    }
  }
}
