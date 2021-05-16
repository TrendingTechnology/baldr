import type { AssetType } from '@bldr/type-definitions'

import { convertDurationToSeconds } from '@bldr/core-browser'

import { ClientMediaAsset, createHtmlElement, CustomEventsManager, Interval, TimeOut, sampleCache, Cache } from './internal'

/**
 * This class manages the counter for one MIME type (`audio`, `image` and `video`).
 */
class MimeTypeShortcutCounter {
  /**
   * `a` for audio files and `v` for video files.
   */
  triggerKey: string

  count: number

  constructor (triggerKey: string) {
    this.triggerKey = triggerKey
    this.count = 0
  }

  /**
   * Get the next available shortcut: `a 1`, `a 2`
   */
  get (): string | undefined {
    if (this.count < 10) {
      this.count++
      if (this.count === 10) {
        return `${this.triggerKey} 0`
      }
      return `${this.triggerKey} ${this.count}`
    }
  }

  reset (): void {
    this.count = 0
  }
}

export class ShortcutManager {
  private readonly audio: MimeTypeShortcutCounter
  private readonly image: MimeTypeShortcutCounter
  private readonly video: MimeTypeShortcutCounter

  constructor () {
    this.audio = new MimeTypeShortcutCounter('a')
    this.image = new MimeTypeShortcutCounter('i')
    this.video = new MimeTypeShortcutCounter('v')
  }

  addShortcut (sample: Sample): void {
    if (sample.shortcut != null) return
    if (sample.asset.mimeType === 'audio') {
      sample.shortcut = this.audio.get()
    } else if (sample.asset.mimeType === 'image') {
      sample.shortcut = this.image.get()
    } else if (sample.asset.mimeType === 'video') {
      sample.shortcut = this.video.get()
    }
  }

  reset (): void {
    this.audio.reset()
    this.image.reset()
    this.video.reset()
  }
}

export const shortcutManager = new ShortcutManager()

/**
 * The state of the current playback.
 */
type PlaybackState = 'started' | 'fadein' | 'playing' | 'fadeout' | 'stopped'

type JumpDirection = 'forward' | 'backward'

/**
 * We fade in very short and smoothly to avoid audio artefacts.
 */
const defaultFadeInSec: number = 0.3

/**
 * We never stop. Instead we fade out very short and smoothly.
 */
const defaultFadeOutSec: number = 1

/**
 * Number of milliseconds to wait before the media file is played.
 */
const defaultPlayDelayMsec: number = 10

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
   * To be able to distinguish the old and the new version of the class.
   *
   * TODO remove
   */
   ng: boolean = true

  /**
   * The parent media file object.
   *
   */
  asset: ClientMediaAsset

  /**
   * Raw data coming from the YAML format.
   */
  yaml: AssetType.SampleYamlFormat

  /**
   * The corresponding HTML media element, a object of the
   * corresponding `<audio/>` or `<video/>` element.
   */
  htmlElement: HTMLMediaElement

  /**
   * The current volume of the parent media Element. This value gets stored
   * when the sample is paused. It is needed to restore the volume.
   */
  private htmlElementCurrentVolume: number = 1

  /**
    * The current time of the parent media Element. This value gets stored
    * when the sample is paused.
    */
  private htmlElementCurrentTimeSec: number = 0

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
   * The shortcut key stroke combination to launch the sample for example `a 1`, `v 1` or `i 1`.
   */
  shortcut?: string

  private readonly interval = new Interval()

  private readonly timeOut = new TimeOut()

  private readonly events = new CustomEventsManager()

  playbackState: PlaybackState

  constructor (asset: ClientMediaAsset, yaml: AssetType.SampleYamlFormat) {
    this.asset = asset

    this.yaml = yaml

    if (this.yaml.ref == null) {
      this.yaml.ref = 'complete'
    }

    this.htmlElement = createHtmlElement(asset.mimeType, asset.httpUrl) as HTMLMediaElement

    if (this.yaml.startTime != null) {
      this.startTimeSec = this.toSec(this.yaml.startTime)
    }

    if (this.yaml.duration != null && this.yaml.endTime != null) {
      throw new Error('Specifiy duration or endTime not both. They are mutually exclusive.')
    }

    if (this.yaml.duration != null) {
      this.durationSec_ = this.toSec(this.yaml.duration)
    } else if (this.yaml.endTime != null) {
      this.durationSec_ = this.toSec(this.yaml.endTime) - this.startTimeSec
    }

    if (this.yaml.fadeIn != null) {
      this.fadeInSec_ = this.toSec(this.yaml.fadeIn)
    }

    if (this.yaml.fadeOut != null) {
      this.fadeOutSec_ = this.toSec(this.yaml.fadeOut)
    }

    this.shortcut = this.yaml.shortcut
    shortcutManager.addShortcut(this)
    this.interval = new Interval()
    this.timeOut = new TimeOut()
    this.events = new CustomEventsManager()
    this.playbackState = 'stopped'
  }

  /**
   * The reference of the sample. The reference is used to build the URI of the sample, for
   * example `uri#reference`: `ref:Beethoven#complete`
   */
  get ref (): string {
    const ref = this.yaml.ref == null ? 'complete' : this.yaml.ref
    return `${this.asset.ref}#${ref}`
  }

  /**
   * The title of the sample. For example `komplett`, `Hook-Line`.
   */
  get title (): string {
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
  get titleSafe (): string {
    if (this.yaml.ref === 'complete') {
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
  get yearSafe (): string | undefined {
    if (this.asset.yaml.creationDate != null) {
      return this.asset.yaml.creationDate
    } else if (this.asset.yaml.year != null) {
      return this.asset.yaml.year
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
    return this.htmlElement.currentTime - this.startTimeSec
  }

  /**
   * Time in seconds to fade in.
   */
  get fadeInSec (): number {
    if (this.fadeInSec_ == null) {
      return defaultFadeInSec
    } else {
      return this.fadeInSec_
    }
  }

  /**
   * Time in seconds to fade out.
   */
  get fadeOutSec (): number {
    if (this.fadeOutSec_ == null) {
      return defaultFadeOutSec
    } else {
      return this.fadeOutSec_
    }
  }

  /**
   * In how many milliseconds we have to start a fade out process.
   */
  private get fadeOutStartTimeMsec (): number {
    return (this.durationRemainingSec - this.fadeOutSec) * 1000
  }

  /**
   * The duration of the sample in seconds. If the duration is set on the
   * sample, it is the same as `sample.durationSec_`.
   */
  get durationSec (): number {
    if (this.durationSec_ == null) {
      // Samples without duration play until the end fo the media file.
      return this.htmlElement.duration - this.startTimeSec
    }
    return this.durationSec_
  }

  /**
   * The remaining duration of the sample in seconds.
   */
  get durationRemainingSec (): number {
    return this.durationSec - this.currentTimeSec
  }

  /**
   * A number between 0 and 1. 0: the sample starts from the beginning. 1:
   * the sample reaches the end.
   */
  get progress (): number {
    // for example:
    // current time: 6s duration: 60s
    // 6 / 60 = 0.1
    return this.currentTimeSec / this.durationSec
  }

  get volume (): number {
    return this.htmlElement.volume
  }

  /**
   * Set the volume and simultaneously the opacity of a video element, to be
   * able to fade out or fade in a video and a audio file.
   */
  set volume (value: number) {
    this.htmlElement.volume = parseFloat(value.toFixed(2))
    if (this.asset.mimeType === 'video') {
      this.htmlElement.style.opacity = value.toFixed(2)
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
      durationSafe = defaultFadeInSec
    } else {
      durationSafe = duration
    }
    return await new Promise((resolve, reject) => {
      // Fade in can triggered when a fade out process is started and
      // not yet finished.
      this.interval.clear()
      this.events.trigger('fadeinbegin')
      this.playbackState = 'fadein'
      let actualVolume = 0
      this.htmlElement.volume = 0
      this.htmlElement.play().then(() => {}, () => {})
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
          this.events.trigger('fadeinend')
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
  start (targetVolume: number): void {
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
    if (fadeInSec == null) fadeInSec = this.fadeInSec
    // The start() triggers play with this.startTimeSec. “complete” samples
    // have on this.startTimeSec 0.
    if (startTimeSec != null || startTimeSec === 0) {
      this.htmlElement.currentTime = startTimeSec
    } else if (this.htmlElementCurrentTimeSec != null) {
      this.htmlElement.currentTime = this.htmlElementCurrentTimeSec
    } else {
      this.htmlElement.currentTime = this.startTimeSec
    }

    // To prevent AbortError in Firefox, artefacts when switching through the
    // audio files.
    this.timeOut.set(() => {
      this.fadeIn(targetVolume, this.fadeInSec).then(
        () => {},
        () => {}
      )
      this.scheduleFadeOut()
    }, defaultPlayDelayMsec)
  }

  /**
   * Schedule when the fade out process has to start.
   * Always fade out at the end. Maybe the samples are cut without a
   * fade out.
   */
  private scheduleFadeOut (): void {
    this.timeOut.set(
      () => {
        this.fadeOut(this.fadeOutSec).then(
          () => {},
          () => {}
        )
      },
      this.fadeOutStartTimeMsec
    )
  }

  /**
   * @param duration - in seconds
   */
  async fadeOut (duration?: number): Promise<void> {
    let durationSafe: number
    if (duration == null) {
      durationSafe = defaultFadeOutSec
    } else {
      durationSafe = duration
    }
    return await new Promise((resolve, reject) => {
      if (this.htmlElement.paused) resolve(undefined)
      // Fade out can triggered when a fade out process is started and
      // not yet finished.
      this.interval.clear()
      this.events.trigger('fadeoutbegin')
      this.playbackState = 'fadeout'
      // Number from 0 - 1
      let actualVolume = this.htmlElement.volume
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
          if (this.htmlElement != null) this.htmlElement.pause()
          this.interval.clear()
          this.events.trigger('fadeoutend')
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
    if (this.htmlElement.paused) return
    await this.fadeOut(fadeOutSec)
    this.htmlElement.currentTime = this.startTimeSec
    this.timeOut.clear()
    if (this.asset.mimeType === 'video') {
      this.htmlElement.load()
      this.htmlElement.style.opacity = '1'
    }
  }

  /**
   * Pause the sample at the current position and set the video element to
   * opacity 0. The properties `mediaElementCurrentTimeSec_` and
   * `mediaElementCurrentVolume_` are set or
   * updated.
   */
  async pause (): Promise<void> {
    await this.fadeOut()
    this.timeOut.clear()
    if (this.asset.mimeType === 'video') {
      this.htmlElement.style.opacity = '0'
    }
    this.htmlElementCurrentTimeSec = this.htmlElement.currentTime
    this.htmlElementCurrentVolume = this.htmlElement.volume
  }

  /**
   * Toggle between `sample.pause()` and `sample.play()`. If a sample is loaded
   * start this sample.
   */
  toggle (targetVolume: number = 1): void {
    if (this.htmlElement.paused) {
      this.play(targetVolume)
    } else {
      this.pause().then(
        () => {},
        () => {}
      )
    }
  }

  /**
   * Jump to a new time position.
   */
  private jump (interval: number = 10, direction: JumpDirection = 'forward'): void {
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
    this.htmlElement.currentTime = this.startTimeSec + newPlayPosition
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

export class SampleCollection extends Cache<Sample> {
  constructor (asset: ClientMediaAsset) {
    super()
    this.addFromAsset(asset)
  }

  private addSample (asset: ClientMediaAsset, yamlFormat: AssetType.SampleYamlFormat): void {
    const sample = new Sample(asset, yamlFormat)
    if (this.get(sample.ref) == null) {
      sampleCache.add(sample.ref, sample)
      this.add(sample.ref, sample)
    }
  }

  /**
   * Gather informations to build the default sample “complete”.
   */
  private gatherYamlFromRoot (assetFormat: AssetType.YamlFormat): AssetType.SampleYamlFormat | undefined {
    const yamlFormat: AssetType.SampleYamlFormat = {}
    if (assetFormat.startTime != null) yamlFormat.startTime = assetFormat.startTime
    if (assetFormat.duration != null) yamlFormat.duration = assetFormat.duration
    if (assetFormat.endTime != null) yamlFormat.endTime = assetFormat.endTime
    if (assetFormat.fadeIn != null) yamlFormat.startTime = assetFormat.fadeIn
    if (assetFormat.fadeOut != null) yamlFormat.startTime = assetFormat.fadeOut
    if (assetFormat.shortcut != null) yamlFormat.shortcut = assetFormat.shortcut
    if (Object.keys(yamlFormat).length > 0) {
      return yamlFormat
    }
  }

  private addFromAsset (asset: ClientMediaAsset): void {
    // search the “complete” sample from the property “samples”.
    let completeYamlFromSamples: AssetType.SampleYamlFormat | undefined
    if (asset.yaml.samples != null) {
      for (let i = 0; i < asset.yaml.samples.length; i++) {
        const sampleYaml = asset.yaml.samples[i]
        if (sampleYaml.ref != null && sampleYaml.ref === 'complete') {
          completeYamlFromSamples = sampleYaml
          asset.yaml.samples.splice(i, 1)
          break
        }
      }
    }

    // First add default sample “complete”
    const completeYamlFromRoot = this.gatherYamlFromRoot(asset.yaml)

    if (completeYamlFromSamples != null && completeYamlFromRoot != null) {
      throw new Error('Duplicate definition of the default complete sample')
    } else if (completeYamlFromSamples != null) {
      this.addSample(asset, completeYamlFromSamples)
    } else if (completeYamlFromRoot != null) {
      this.addSample(asset, completeYamlFromRoot)
    } else {
      this.addSample(asset, {})
    }

    let counter = 0

    // Add samples from the YAML property “samples”
    if (asset.yaml.samples != null) {
      for (const sampleSpec of asset.yaml.samples) {
        if (sampleSpec.ref == null && sampleSpec.title == null) {
          counter++
          sampleSpec.ref = `sample${counter}`
          sampleSpec.title = `Ausschnitt ${counter}`
        }
        this.addSample(asset, sampleSpec)
      }
    }
  }
}
