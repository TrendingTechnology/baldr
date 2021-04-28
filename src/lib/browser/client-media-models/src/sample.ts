// import { CustomEventsManager } from './custom-events-manager'
// import { TimeOut } from './timer'

import { ClientMediaAsset } from "./client-media-asset"

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

interface SampleSpec {
  title: string
  id: string
  startTime?: number
  fadeIn?: number
  duration?: number
  fadeOut?: number
  endTime?: number
  shortcut?: string
}

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
class Sample {

  /**
   * We fade in very short and smoothly to avoid audio artefacts.
   */
  defaultFadeInSec: number

  /**
   * We never stop. Instead we fade out very short and smoothly.
   */
  defaultFadeOutSec: number

  /**
   * Number of milliseconds to wait before the media file is played.
   */
  defaultPlayDelayMsec: number

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
  startTimeSec: number

  /**
   * Use the getter functions `sample.durationSec`.
   */
  private durationSec: number

  /**
   * Use the getter function `sample.fadeInSec`
   */
  private fadeInSec_: number

  /**
   * Use the getter function `sample.fadeOutSec`
   */
  private fadeOutSec_: number

  /**
   * The current volume of the parent media Element. This value gets stored
   * when the sample is paused. It is needed to restore the volume.
   */
  private mediaElementCurrentVolume: number

  /**
   * The current time of the parent media Element. This value gets stored
   * when the sample is paused.
   */
  private mediaElementCurrentTimeSec: number

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

  private interval = new Interval()

  private timeOut = new TimeOut()

  private customEventsManager = new CustomEventsManager()

  playbackState: PlaybackState

  /**
   * @param {ClientMediaAsset} asset
   * @param {object} specs
   * @property {String} specs.title
   * @property {String|Number} specs.id
   * @property {String|Number} specs.startTime - The start time in seconds.
   * @property {String|Number} specs.fadeIn - The fade in time in seconds. The
   *   duration is not affected by this time specification.
   * @property {String|Number} specs.duration - The duration in seconds of
   *   the sample.
   * @property {String|Number} specs.fadeOut - The fade out time in seconds. The
   *   duration is not affected by this time specification.
   * @property {String|Number} specs.endTime - The end time in seconds.
   * @property {String} specs.shortcut - A custom shortcut
   */
  constructor (asset: ClientMediaAsset, { title, id, startTime, fadeIn, duration, fadeOut, endTime, shortcut }: SampleSpec) {
    this.defaultFadeInSec = 0.3
    this.defaultFadeOutSec = 1
    this.defaultPlayDelayMsec = 10
    this.asset = asset
    this.title = title

    if (!id) {
      throw new Error('A sample needs an id.')
    }
    this.id = id
    this.uri = `${this.asset.uri}#${id}`
    this.startTimeSec = this.toSec(startTime)

    if (duration && endTime) {
      throw new Error('Specifiy duration or endTime not both. They are mutually exclusive.')
    }

    duration = this.toSec(duration)
    if (duration) {
      this.durationSec = duration
    } else if (endTime) {
      this.durationSec = this.toSec(endTime) - this.startTimeSec
    }

    if (fadeIn) {
      this.fadeInSec_ = this.toSec(fadeIn)
    }

    if (fadeOut) {
      this.fadeOutSec_ = this.toSec(fadeOut)
    }

    this.mediaElementCurrentVolume = 1
    this.mediaElementCurrentTimeSec = 0
    this.shortcutCustom = shortcut
    this.interval = new Interval()
    this.timeOut = new TimeOut()
    this.customEventsManager = new CustomEventsManager()
    this.playbackState = 'stopped'
  }

  /**
   * The URI using the `id` authority.

   */
  get uriId(): string {
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
   * Combined value build from `this.asset.artist` and `this.asset.composer`.
   *
   * @returns {String}
   */
  get artistSafe () {
    let artist, composer
    if (this.asset.artist) {
      artist = `<em class="person">${this.asset.artist}</em>`
    }
    if (this.asset.composer) {
      composer = `<em class="person">${this.asset.composer}</em>`
    }
    if (artist === composer) {
      return artist
    } else if (artist && composer) {
      return `${composer} (${artist})`
    } else if (artist && !composer) {
      return artist
    } else if (!artist && composer) {
      return composer
    }
  }

  /**
   * Combined value build from `this.asset.creationDate` and `this.asset.year`.
   */
  get yearSafe(): string | undefined {
    if (this.asset.meta.creationDate != null) {
      return this.asset.meta.creationDate
    } else if (this.asset.meta.year != null) {
      return this.asset.meta.year
    }
  }

  /**
   * Convert strings to numbers, so we can use them as seconds.
   *
   * @param {String|Number} timeIntervaleString
   *
   * @private
   */
  private toSec (timeIntervaleString) {
    return convertDurationToSeconds(timeIntervaleString)
  }

  /**
   * The current time of the sample. It starts from zero.
   *
   * @type {Number}
   */
  get currentTimeSec () {
    return this.mediaElement.currentTime - this.startTimeSec
  }

  /**
   * Time in seconds to fade in.
   *
   * @type {Number}
   */
  get fadeInSec () {
    if (!this.fadeInSec_) {
      return this.router
    } else {
      return this.fadeInSec_
    }
  }

  /**
   * Time in seconds to fade out.
   *
   * @type {Number}
   */
  get fadeOutSec () {
    if (!this.fadeOutSec_) {
      return this.defaultFadeOutSec
    } else {
      return this.fadeOutSec_
    }
  }

  /**
   * In how many milliseconds we have to start a fade out process.
   *
   * @private
   */
  get fadeOutStartTimeMsec_ () {
    return (this.durationRemainingSec - this.fadeOutSec) * 1000
  }

  /**
   * The duration of the sample in seconds. If the duration is set on the
   * sample, it is the same as `sample.durationSec_`.
   *
   * @type {Number}
   */
  get durationSec () {
    if (!this.durationSec) {
      // Samples without duration play until the end fo the media file.
      return this.mediaElement.duration - this.startTimeSec
    } else {
      return this.durationSec
    }
  }

  /**
   * The remaining duration of the sample in seconds.
   *
   * @type {Number}
   */
  get durationRemainingSec () {
    return this.durationSec - this.currentTimeSec
  }

  /**
   * A number between 0 and 1. 0: the sample starts from the beginning. 1:
   * the sample reaches the end.
   *
   * @type {Number}
   */
  get progress () {
    // for example:
    // current time: 6s duration: 60s
    // 6 / 60 = 0.1
    return this.currentTimeSec / this.durationSec
  }

  /**
   * Set the volume and simultaneously the opacity of a video element, to be
   * able to fade out or fade in a video and a audio file.
   */
  set volume (value) {
    this.mediaElement.volume = value.toFixed(2)
    if (this.asset.mimeType === 'video') {
      this.mediaElement.style.opacity = value.toFixed(2)
    }
  }

  /**
   * Fade in. Set the volume to 0 and reach after a time intervale, specified
   * with `duration` the `targetVolume.`
   *
   * @param {Number} targetVolume - End volume value of the fade in process. A
   *   number from 0 - 1.
   * @param {Number} duration - in seconds
   *
   * @async
   *
   * @returns {Promise}
   */
  fadeIn (targetVolume = 1, duration) {
    if (!targetVolume) targetVolume = 1
    if (!duration) duration = this.defaultFadeInSec
    return new Promise((resolve, reject) => {
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
      const stepInterval = duration * 10
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
   * @param {Number} targetVolume - End volume value of the fade in process. A
   *   number from 0 - 1.
   */
  start (targetVolume) {
    this.playbackState = 'started'
    this.play(targetVolume, this.startTimeSec)
  }

  /**
   * Play a sample from `startTimeSec`.
   *
   * @param {Number} targetVolume - End volume value of the fade in process. A
   *   number from 0 - 1.
   * @param {Number} startTimeSec - Position in the sample from where to play
   *   the sample
   */
  play (targetVolume, startTimeSec, fadeInSec) {
    if (!fadeInSec) fadeInSec = this.fadeInSec
    // The start() triggers play with this.startTimeSec. “complete” samples
    // have on this.startTimeSec 0.
    if (startTimeSec || startTimeSec === 0) {
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
      this.scheduleFadeOut_()
    }, this.defaultPlayDelayMsec)
  }

  /**
   * Schedule when the fade out process has to start.
   * Always fade out at the end. Maybe the samples are cut without a
   * fade out.
   * @private
   */
  scheduleFadeOut_ () {
    this.timeOut.set(
      () => { this.fadeOut(this.fadeOutSec) },
      this.fadeOutStartTimeMsec_
    )
  }

  /**
   * @param {Number} duration - in seconds
   *
   * @async
   *
   * @returns {Promise}
   */
  fadeOut (duration) {
    if (!duration) duration = this.defaultFadeOutSec
    return new Promise((resolve, reject) => {
      if (this.mediaElement.paused) resolve()
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
      const stepInterval = duration * 10
      this.interval.set(() => {
        actualVolume -= steps
        if (actualVolume >= 0) {
          this.volume = actualVolume
        } else {
          // The video opacity must be set to zero.
          this.volume = 0
          this.mediaElement.pause()
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
   * @param {Number} fadeOutSec - Duration in seconds to fade out the sample.
   */
  async stop (fadeOutSec) {
    if (this.mediaElement.paused) return
    await this.fadeOut(fadeOutSec)
    this.mediaElement.currentTime = this.startTimeSec
    this.timeOut.clear()
    if (this.asset.mimeType === 'video') {
      this.mediaElement.load()
      this.mediaElement.style.opacity = 1
    }
  }

  /**
   * Pause the sample at the current position and set the video element to
   * opacity 0. The properties `mediaElementCurrentTimeSec_` and
   * `mediaElementCurrentVolume_` are set or
   * updated.
   */
  async pause () {
    await this.fadeOut()
    this.timeOut.clear()
    if (this.asset.mimeType === 'video') {
      this.mediaElement.style.opacity = 0
    }
    this.mediaElementCurrentTimeSec = this.mediaElement.currentTime
    this.mediaElementCurrentVolume = this.mediaElement.volume
  }

  /**
   * Toggle between `sample.pause()` and `sample.play()`. If a sample is loaded
   * start this sample.
   */
  toggle (targetVolume = 1) {
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
    this.scheduleFadeOut_()
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
