import { ClientMediaAsset } from './client-media-asset'
import { convertDurationToSeconds } from '@bldr/core-browser'
import type { AssetType } from '@bldr/type-definitions'

/**
 * The state of the current playback.
 *
 * - started
 * - fadein
 * - playing
 * - fadeout
 * - stopped
 */
type PlaybackState = 'started' | 'fadein' | 'playing' | 'fadeout' | 'stopped'

type JumpDirection = 'forward' | 'backward'

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
export class Sample {
  /**
   * We fade in very short and smoothly to avoid audio artefacts.
   */
  defaultFadeInSec: number = 0.3

  /**
   * We never stop. Instead we fade out very short and smoothly.
   */
  defaultFadeOutSec: number = 1

  /**
   * Number of milliseconds to wait before the media file is played.
   */
  defaultPlayDelayMsec: number = 10

  /**
   * The parent media file object.
   *
   */
  asset: ClientMediaAsset

  /**
   * The corresponding HTML media element, a object of the
   * corresponding `<audio/>` or `<video/>` element.
   */
  mediaElement?: HTMLMediaElement

  /**
   * The title of the sample. For example `komplett`, `Hook-Line`.
   */
  title: string

  /**
   * The ID of the sample. The ID is used to build the URI of the sample, for
   * example `uri#id`: `id:Beethoven#complete`
   */
  id: string

  /**
   * The URI of the sample in the format `uri#id`: for example
   * `id:Beethoven#complete`
   */
  uri: string

  /**
   * The start time in seconds. The sample is played from this start time
   * using the `mediaElement` of the `asset`. It is the “zero” second
   * for the sample.
   */
  startTimeSec: number = 0

  /**
   * Use the getter functions `sample.durationSec`.
   */
  private readonly durationSec_?: number

  /**
   * Use the getter function `sample.fadeInSec`
   */
  private readonly fadeInSec_?: number

  /**
   * Use the getter function `sample.fadeOutSec`
   */
  private readonly fadeOutSec_?: number

  /**
   * The current volume of the parent media Element. This value gets stored
   * when the sample is paused. It is needed to restore the volume.
   */
  private mediaElementCurrentVolume: number = 1

  /**
   * The current time of the parent media Element. This value gets stored
   * when the sample is paused.
   */
  private mediaElementCurrentTimeSec: number = 0

  /**
   * The actual shortcut. If `shortcutCustom` is set, it is the same as this
   * value.
   */
  shortcut?: number

  /**
   * The shortcut number. 1 means: To play the sample type in “a 1” if it
   * is a audio file or “v 1” if it is a video file.
   */
  shortcutNo?: number

  /**
   * A custom shortcut, for example “k 1”
   */
  shortcutCustom?: string

  private readonly interval = new Interval()

  private readonly timeOut = new TimeOut()

  private readonly customEventsManager = new CustomEventsManager()

  playbackState: PlaybackState

  constructor (
    asset: ClientMediaAsset,
    { title, id, startTime, fadeIn, duration, fadeOut, endTime, shortcut }: AssetType.SampleYamlFormat
  ) {
    this.asset = asset
    this.title = title == null ? 'komplett' : title
    this.id = id == null ? 'complete' : id
    this.uri = `${this.asset.uri}#${id}`
    if (startTime != null) {
      this.startTimeSec = this.toSec(startTime)
    }

    if (duration != null && endTime != null) {
      throw new Error('Specifiy duration or endTime not both. They are mutually exclusive.')
    }

    if (duration != null) {
      this.durationSec_ = this.toSec(duration)
    } else if (endTime != null) {
      this.durationSec_ = this.toSec(endTime) - this.startTimeSec
    }

    if (fadeIn != null) {
      this.fadeInSec_ = this.toSec(fadeIn)
    }

    if (fadeOut != null) {
      this.fadeOutSec_ = this.toSec(fadeOut)
    }

    this.shortcutCustom = shortcut
    this.interval = new Interval()
    this.timeOut = new TimeOut()
    this.customEventsManager = new CustomEventsManager()
    this.playbackState = 'stopped'
  }

  /**
   * The URI using the `id` authority.
   */
  get uriId (): string {
    return `${this.asset.id}#${this.id}`
  }

  /**
   * The URI using the `uuid` authority.
   */
  get uriUuid (): string {
    return `${this.asset.uri}#${this.id}`
  }

  /**
   * If the sample is the complete media file get the title of the media file.
   * For example `Glocken (Das große Tor von Kiew)`
   */
  get titleSafe (): string {
    if (this.id === 'complete') {
      return this.asset.titleSafe
    } else {
      return `${this.title} (${this.asset.titleSafe})`
    }
  }

  /**
   * Combined value build from `this.asset.meta.artist` and `this.asset.meta.composer`.
   */
  get artistSafe (): string | undefined {
    let artist: string | null = null
    let composer: string | null = null
    if (this.asset.meta.artist != null) {
      artist = `<em class="person">${this.asset.meta.artist}</em>`
    }
    if (this.asset.meta.composer != null) {
      composer = `<em class="person">${this.asset.meta.composer}</em>`
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
   * Combined value build from `this.asset.meta.creationDate` and
   * `this.asset.meta.year`.
   */
  get yearSafe (): string | undefined {
    if (this.asset.meta.creationDate != null) {
      return this.asset.meta.creationDate
    } else if (this.asset.meta.year != null) {
      return this.asset.meta.year
    }
  }

  /**
   * Convert strings to numbers, so we can use them as seconds.
   */
  private toSec (timeIntervaleString: string | number): number {
    return convertDurationToSeconds(timeIntervaleString)
  }

  /**
   * The current time of the sample. It starts from zero.
   */
  get currentTimeSec (): number {
    if (this.mediaElement != null) {
      return this.mediaElement.currentTime - this.startTimeSec
    }
    return 0
  }

  /**
   * Time in seconds to fade in.
   */
  get fadeInSec (): number {
    if (!this.fadeInSec_) {
      return this.defaultFadeInSec
    } else {
      return this.fadeInSec_
    }
  }

  /**
   * Time in seconds to fade out.
   */
  get fadeOutSec (): number {
    if (!this.fadeOutSec_) {
      return this.defaultFadeOutSec
    } else {
      return this.fadeOutSec_
    }
  }

  /**
   * In how many milliseconds we have to start a fade out process.
   */
  private get fadeOutStartTimeMsec_ () {
    return (this.durationRemainingSec - this.fadeOutSec) * 1000
  }

  /**
   * The duration of the sample in seconds. If the duration is set on the
   * sample, it is the same as `sample.durationSec_`.
   */
  get durationSec (): number {
    if (this.durationSec_ == null && this.mediaElement != null) {
      // Samples without duration play until the end fo the media file.
      return this.mediaElement.duration - this.startTimeSec
    } else if (this.durationSec_ != null) {
      return this.durationSec_
    }
    return 0
  }

  /**
   * The remaining duration of the sample in seconds.
   */
  get durationRemainingSec (): number {
    if (this.durationSec_ != null) {
      return this.durationSec_ - this.currentTimeSec
    }
    return 0
  }

  /**
   * A number between 0 and 1. 0: the sample starts from the beginning. 1:
   * the sample reaches the end.
   */
  get progress (): number {
    if (this.durationSec_ == null) return 0
    // for example:
    // current time: 6s duration: 60s
    // 6 / 60 = 0.1
    return this.currentTimeSec / this.durationSec_
  }

  /**
   * Set the volume and simultaneously the opacity of a video element, to be
   * able to fade out or fade in a video and a audio file.
   */
  set volume (value: number) {
    if (this.mediaElement == null) return
    this.mediaElement.volume = parseFloat(value.toFixed(2))
    if (this.asset.mimeType === 'video') {
      this.mediaElement.style.opacity = value.toFixed(2)
    }
  }

  /**
   * Fade in. Set the volume to 0 and reach after a time intervale, specified
   * with `duration` the `targetVolume.`
   *
   * @param targetVolume - End volume value of the fade in process. A
   *   number from 0 - 1.
   * @param duration - in seconds
   */
  async fadeIn (targetVolume: number = 1, duration?: number): Promise<void> {
    let durationSafe: number
    if (duration == null) {
      durationSafe = this.defaultFadeInSec
    } else {
      durationSafe = duration
    }
    return await new Promise((resolve, reject) => {
      if (this.mediaElement == null) return
      // Fade in can triggered when a fade out process is started and
      // not yet finished.
      this.interval.clear()
      this.customEventsManager.trigger('fadeinbegin')
      this.playbackState = 'fadein'
      let actualVolume = 0
      this.mediaElement.volume = 0
      this.mediaElement.play()
      // Normally 0.01 by volume = 1
      const steps = targetVolume / 100
      // Interval: every X ms reduce volume by step
      // in milliseconds: duration * 1000 / 100
      const stepInterval = durationSafe * 10
      this.interval.set(() => {
        actualVolume += steps
        if (actualVolume <= targetVolume) {
          this.volume = actualVolume
        } else {
          this.interval.clear()
          this.customEventsManager.trigger('fadeinend')
          this.playbackState = 'playing'
          resolve()
        }
      }, stepInterval)
    })
  }

  /**
   * Start and play a sample from the beginning.
   *
   * @param targetVolume - End volume value of the fade in process. A
   *   number from 0 - 1.
   */
  start (targetVolume: number) {
    this.playbackState = 'started'
    this.play(targetVolume, this.startTimeSec)
  }

  /**
   * Play a sample from `startTimeSec`.
   *
   * @param targetVolume - End volume value of the fade in process. A
   *   number from 0 - 1.
   * @param startTimeSec - Position in the sample from where to play
   *   the sample
   */
  play (targetVolume: number, startTimeSec?: number, fadeInSec?: number): void {
    if (this.mediaElement == null) return
    if (fadeInSec == null) fadeInSec = this.fadeInSec
    // The start() triggers play with this.startTimeSec. “complete” samples
    // have on this.startTimeSec 0.
    if (startTimeSec != null || startTimeSec === 0) {
      this.mediaElement.currentTime = startTimeSec
    } else if (this.mediaElementCurrentTimeSec) {
      this.mediaElement.currentTime = this.mediaElementCurrentTimeSec
    } else {
      this.mediaElement.currentTime = this.startTimeSec
    }

    // To prevent AbortError in Firefox, artefacts when switching through the
    // audio files.
    this.timeOut.set(() => {
      this.fadeIn(targetVolume, this.fadeInSec)
      this.scheduleFadeOut()
    }, this.defaultPlayDelayMsec)
  }

  /**
   * Schedule when the fade out process has to start.
   * Always fade out at the end. Maybe the samples are cut without a
   * fade out.
   */
  private scheduleFadeOut () {
    this.timeOut.set(
      () => { this.fadeOut(this.fadeOutSec) },
      this.fadeOutStartTimeMsec_
    )
  }

  /**
   * @param duration - in seconds
   */
  async fadeOut (duration?: number): Promise<void> {
    let durationSafe: number
    if (duration == null) {
      durationSafe = this.defaultFadeOutSec
    } else {
      durationSafe = duration
    }
    return await new Promise((resolve, reject) => {
      if (this.mediaElement == null) return
      if (this.mediaElement.paused) resolve(undefined)
      // Fade out can triggered when a fade out process is started and
      // not yet finished.
      this.interval.clear()
      this.customEventsManager.trigger('fadeoutbegin')
      this.playbackState = 'fadeout'
      // Number from 0 - 1
      let actualVolume = this.mediaElement.volume
      // Normally 0.01 by volume = 1
      const steps = actualVolume / 100
      // Interval: every X ms reduce volume by step
      // in milliseconds: duration * 1000 / 100
      const stepInterval = durationSafe * 10
      this.interval.set(() => {
        actualVolume -= steps
        if (actualVolume >= 0) {
          this.volume = actualVolume
        } else {
          // The video opacity must be set to zero.
          this.volume = 0
          if (this.mediaElement != null) this.mediaElement.pause()
          this.interval.clear()
          this.customEventsManager.trigger('fadeoutend')
          this.playbackState = 'stopped'
          resolve()
        }
      }, stepInterval)
    })
  }

  /**
   * Stop the playback of a sample and reset the current play position to the
   * beginning of the sample. If the sample is a video, show the poster
   * (the preview image) again by triggering the `load()` method of the
   * corresponding media element.
   *
   * @param fadeOutSec - Duration in seconds to fade out the sample.
   */
  async stop (fadeOutSec?: number): Promise<void> {
    if (this.mediaElement == null || this.mediaElement.paused) return
    await this.fadeOut(fadeOutSec)
    this.mediaElement.currentTime = this.startTimeSec
    this.timeOut.clear()
    if (this.asset.mimeType === 'video') {
      this.mediaElement.load()
      this.mediaElement.style.opacity = '1'
    }
  }

  /**
   * Pause the sample at the current position and set the video element to
   * opacity 0. The properties `mediaElementCurrentTimeSec_` and
   * `mediaElementCurrentVolume_` are set or
   * updated.
   */
  async pause (): Promise<void> {
    if (this.mediaElement == null) return
    await this.fadeOut()
    this.timeOut.clear()
    if (this.asset.mimeType === 'video') {
      this.mediaElement.style.opacity = '0'
    }
    this.mediaElementCurrentTimeSec = this.mediaElement.currentTime
    this.mediaElementCurrentVolume = this.mediaElement.volume
  }

  /**
   * Toggle between `sample.pause()` and `sample.play()`. If a sample is loaded
   * start this sample.
   */
  toggle (targetVolume: number = 1) {
    if (this.mediaElement?.paused) {
      this.play(targetVolume)
    } else {
      this.pause()
    }
  }

  /**
   * Jump to a new time position.
   */
  private jump (interval: number = 10, direction = 'forward'): void {
    if (this.mediaElement == null) return
    let newPlayPosition
    const cur = this.currentTimeSec
    if (direction === 'backward') {
      if (cur - interval > 0) {
        newPlayPosition = cur - interval
      } else {
        newPlayPosition = 0
      }
    } else {
      newPlayPosition = this.currentTimeSec + interval
      if (cur + interval < this.durationSec) {
        newPlayPosition = cur + interval
      } else {
        newPlayPosition = this.durationSec
      }
    }
    this.timeOut.clear()
    this.mediaElement.currentTime = this.startTimeSec + newPlayPosition
    this.scheduleFadeOut()
  }

  /**
   * Jump forwards.
   *
   * @param interval - Time interval in seconds.
   */
  forward (interval: number = 10): void {
    this.jump(interval, 'forward')
  }

  /**
   * Jump backwards.
   *
   * interval - Time interval in seconds.
   */
  backward (interval: number = 10): void {
    this.jump(interval, 'backward')
  }
}
