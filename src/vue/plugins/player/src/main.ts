import { Sample, Cache, Resolver } from '@bldr/media-resolver-ng'

type EventCallbackFunction = (...args: any) => {}

type EventName = 'fadeinbegin' | 'fadeinend' | 'fadeoutbegin' | 'fadeoutend'

/**
 * A simple wrapper class for a custom event system. Used in the classes
 * `Playable()` and `Player()`.
 */
export class CustomEventsManager {
  /**
   * An object of callback functions
   */
  private callbacks: { [key: string]: EventCallbackFunction[] }

  constructor () {
    this.callbacks = {}
  }

  /**
   * Trigger a custom event.
   *
   * @param name - The name of the event. Should be in lowercase, for
   *   example `fadeoutbegin`.
   * @param args - One ore more additonal arguments to pass through
   *   the callbacks.
   */
  trigger (name: EventName, ...args: any[]): void {
    if (this.callbacks[name] == null) {
      this.callbacks[name] = []
    }
    for (const callback of this.callbacks[name]) {
      callback.apply(null, args)
    }
  }

  /**
   * Register callbacks for specific custom event.
   *
   * @param name - The name of the event. Should be in lowercase, for
   *   example `fadeoutbegin`.
   * @param callback - A function which gets called when the
   *   event is triggered.
   */
  on (name: EventName, callback: EventCallbackFunction): void {
    if (this.callbacks[name] == null) {
      this.callbacks[name] = []
    }
    this.callbacks[name].push(callback)
  }
}

class Timer {
  /**
   * An array of `setTimeout` or `setInterval` IDs.
   */
  protected ids: number[]

  constructor () {
    this.ids = []
  }
}

/**
 * We have to clear the timeouts. A not yet finished playback with a
 * duration - stopped to early - cases that the next playback gets stopped
 * to early.
 */
export class TimeOutExecutor extends Timer {
  set (func: () => void, delay: number): void {
    this.ids.push(setTimeout(func, delay))
  }

  clear (): void {
    for (const id of this.ids) {
      clearTimeout(id)
    }
  }
}

/**
 * Wrapper class around the function `setInterval` to store the `id`s returned
 * by the function to be able to clear the function.
 */
export class IntervalExecutor extends Timer {
  /**
   * Repeatedly call a function.
   *
   * @param func - A function to be executed every delay
   *   milliseconds.
   * @param delay - The time, in milliseconds (thousandths of a
   *   second), the timer should delay in between executions of the specified
   *   function or code.
   */
  set (func: () => void, delay: number): void {
    this.ids.push(setInterval(func, delay))
  }

  /**
   * Cancel a timed, repeating action which was previously established by a
   * call to set().
   */
  clear (): void {
    for (const id of this.ids) {
      clearInterval(id)
    }
  }
}

function createHtmlElement (
  mimeType: string,
  httpUrl: string,
  previewHttpUrl?: string
): HTMLMediaElement {
  if (mimeType === 'audio') {
    return new Audio(httpUrl)
  } else if (mimeType === 'video') {
    const video = document.createElement('video')
    video.src = httpUrl
    video.controls = true
    if (previewHttpUrl != null) {
      video.poster = previewHttpUrl
    }
    return video
  } else {
    throw new Error(`Not supported asset type “${mimeType}”.`)
  }
}

/**
 * The state of the current playback.
 */
export type PlaybackState =
  | 'started'
  | 'fadein'
  | 'playing'
  | 'fadeout'
  | 'stopped'

type JumpDirection = 'forward' | 'backward'

export class Playable {
  sample: Sample
  htmlElement: HTMLMediaElement

  currentVolume: number = 1

  public lastPositionSec?: number

  private readonly intervalExecutor = new IntervalExecutor()

  private readonly timeOutExecutor = new TimeOutExecutor()

  private readonly events = new CustomEventsManager()

  playbackState?: PlaybackState

  constructor (sample: Sample, htmlElement: HTMLMediaElement) {
    this.sample = sample
    this.htmlElement = htmlElement
  }

  get currentTimeSec (): number {
    return this.htmlElement.currentTime
  }

  get durationSec (): number {
    if (this.sample.durationSec != null) {
      return this.sample.durationSec
    } else {
      return this.htmlElement.duration
    }
  }

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
    if (this.sample.asset.mimeType === 'video') {
      this.htmlElement.style.opacity = value.toFixed(2)
    }
  }

  private async fadeIn (
    targetVolume: number = 1,
    fadeInDuration?: number
  ): Promise<void> {
    let fadeInSec: number
    if (fadeInDuration == undefined) {
      fadeInSec = this.sample.fadeInSec
    } else {
      fadeInSec = fadeInDuration
    }
    return await new Promise((resolve, reject) => {
      // Fade in can triggered when a fade out process is started and
      // not yet finished.
      this.intervalExecutor.clear()
      this.events.trigger('fadeinbegin')
      this.playbackState = 'fadein'
      let actualVolume = 0
      this.htmlElement.volume = 0
      this.htmlElement.play().then(
        () => {},
        () => {}
      )
      // Normally 0.01 by volume = 1
      const steps = targetVolume / 100
      // Interval: every X ms reduce volume by step
      // in milliseconds: duration * 1000 / 100
      const stepInterval = fadeInSec * 10
      this.intervalExecutor.set(() => {
        actualVolume += steps
        if (actualVolume <= targetVolume) {
          this.volume = actualVolume
        } else {
          this.intervalExecutor.clear()
          this.events.trigger('fadeinend')
          this.playbackState = 'playing'
          resolve()
        }
      }, stepInterval)
    })
  }

  public start (targetVolume: number): void {
    this.playbackState = 'started'
    this.play(targetVolume, this.sample.startTimeSec)
  }

  private play (targetVolume: number, startTimeSec?: number, fadeInSec?: number): void {
    if (fadeInSec == null) {
      fadeInSec = this.sample.fadeInSec
    }
    // The start() triggers play with this.startTimeSec. “complete” samples
    // have on this.startTimeSec 0.
    if (startTimeSec != null || startTimeSec === 0) {
      this.htmlElement.currentTime = startTimeSec
    } else if (this.lastPositionSec != null) {
      this.htmlElement.currentTime = this.lastPositionSec
    } else {
      this.htmlElement.currentTime = this.sample.startTimeSec
    }

    // To prevent AbortError in Firefox, artefacts when switching through the
    // audio files.
    this.timeOutExecutor.set(() => {
      this.fadeIn(targetVolume, fadeInSec).then(
        () => {},
        () => {}
      )
      this.scheduleFadeOut()
    }, 10)
  }

  /**
   * In how many milliseconds we have to start a fade out process.
   */
  private get fadeOutStartTimeMsec (): number {
    return (this.durationRemainingSec - this.sample.fadeOutSec) * 1000
  }

  private get durationRemainingSec (): number {
    return this.durationSec - this.currentTimeSec
  }

  /**
   * Schedule when the fade out process has to start.
   * Always fade out at the end. Maybe the samples are cut without a
   * fade out.
   */
  private scheduleFadeOut (): void {
    this.timeOutExecutor.set(() => {
      this.fadeOut(this.sample.fadeOutSec).then(
        () => {},
        () => {}
      )
    }, this.fadeOutStartTimeMsec)
  }

  private async fadeOut (fadeOutduration?: number): Promise<void> {
    let fadeOutSec: number
    if (fadeOutduration == null) {
      fadeOutSec = this.sample.fadeOutSec
    } else {
      fadeOutSec = fadeOutduration
    }

    return await new Promise((resolve, reject) => {
      if (this.htmlElement.paused) resolve(undefined)
      // Fade out can triggered when a fade out process is started and
      // not yet finished.
      this.intervalExecutor.clear()
      this.events.trigger('fadeoutbegin')
      this.playbackState = 'fadeout'
      // Number from 0 - 1
      let actualVolume = this.htmlElement.volume
      // Normally 0.01 by volume = 1
      const steps = actualVolume / 100
      // Interval: every X ms reduce volume by step
      // in milliseconds: duration * 1000 / 100
      const stepInterval = fadeOutSec * 10
      this.intervalExecutor.set(() => {
        actualVolume -= steps
        if (actualVolume >= 0) {
          this.volume = actualVolume
        } else {
          // The video opacity must be set to zero.
          this.volume = 0
          if (this.htmlElement != null) this.htmlElement.pause()
          this.intervalExecutor.clear()
          this.events.trigger('fadeoutend')
          this.playbackState = 'stopped'
          resolve()
        }
      }, stepInterval)
    })
  }

  public async stop (fadeOutSec?: number): Promise<void> {
    if (this.htmlElement.paused) {
      return
    }
    await this.fadeOut(fadeOutSec)
    this.htmlElement.currentTime = this.sample.startTimeSec
    this.timeOutExecutor.clear()
    if (this.sample.asset.mimeType === 'video') {
      this.htmlElement.load()
      this.htmlElement.style.opacity = '1'
    }
  }

  public async pause (): Promise<void> {
    await this.fadeOut()
    this.timeOutExecutor.clear()
    if (this.sample.asset.mimeType === 'video') {
      this.htmlElement.style.opacity = '0'
    }
    this.lastPositionSec = this.htmlElement.currentTime
    this.currentVolume = this.htmlElement.volume
  }

  public toggle (targetVolume: number = 1): void {
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
  private jump (
    interval: number = 10,
    direction: JumpDirection = 'forward'
  ): void {
    let newPlayPosition
    if (direction === 'backward') {
      if (this.currentTimeSec - interval > 0) {
        newPlayPosition = this.currentTimeSec - interval
      } else {
        newPlayPosition = 0
      }
    } else {
      newPlayPosition = this.currentTimeSec + interval
      if (this.currentTimeSec + interval < this.durationSec) {
        newPlayPosition = this.currentTimeSec + interval
      } else {
        newPlayPosition = this.durationSec
      }
    }
    this.timeOutExecutor.clear()
    this.htmlElement.currentTime = this.sample.startTimeSec + newPlayPosition
    this.scheduleFadeOut()
  }

  public forward (interval: number = 10): void {
    this.jump(interval, 'forward')
  }

  public backward (interval: number = 10): void {
    this.jump(interval, 'backward')
  }
}

class HtmlElementCache extends Cache<HTMLMediaElement> {}

class PlayableCache extends Cache<Playable> {}

class PlayerCache {
  htmlElements: HtmlElementCache
  playables: PlayableCache
  resolver: Resolver

  constructor (resolver: Resolver) {
    this.htmlElements = new HtmlElementCache()
    this.playables = new PlayableCache()
    this.resolver = resolver
  }

  getPlayable (uri: string): Playable {
    const sample = this.resolver.getSample(uri)

    let playable = this.playables.get(sample.ref)
    if (playable != null) {
      return playable
    }

    let htmlElement = this.htmlElements.get(sample.asset.ref)
    if (htmlElement == null) {
      htmlElement = createHtmlElement(
        sample.asset.mimeType,
        sample.asset.httpUrl
      )
      this.htmlElements.add(sample.asset.ref, htmlElement)
    }

    playable = new Playable(sample, htmlElement)
    this.playables.add(sample.ref, playable)
    return playable
  }
}

/**
 * A deeply with vuex coupled media player. Only one media file can be
 * played a the same time.
 */
export class Player {
  private playing?: Playable
  private loaded?: Playable
  private events: CustomEventsManager
  private cache: PlayerCache

  /**
   * Global volume: from 0 - 1
   */
  globalVolume: number = 1

  constructor (resolver: Resolver) {
    this.events = new CustomEventsManager()
    this.cache = new PlayerCache(resolver)
  }

  public getPlayable(uri: string): Playable {
    return this.cache.getPlayable(uri)
  }

  /**
   * Load a sample. Only loaded samples can be played.
   */
  public load (uri: string) {
    this.loaded = this.cache.getPlayable(uri)
  }

  /**
   * Play a loaded sample from the position `sample.startTimeSec` on. Stop the
   * currently playing sample.
   */
  public async start (uri?: string) {
    if (uri != null) {
      this.load(uri)
    }
    if (this.loaded == null) {
      throw new Error('First load a sample')
    }
    this.events.trigger('fadeinbegin', this.loaded)
    if (this.playing != null) {
      await this.playing.stop()
    }
    this.loaded.start(this.globalVolume)
    this.playing = this.loaded
  }

  /**
   * Stop the playback and reset the play position to `sample.startTimeSec` and
   * unload the playing sample.
   *
   * @param fadeOutSec - Duration in seconds to fade out the sample.
   */
  public async stop (fadeOutSec: number) {
    if (this.playing == null) {
      return
    }
    await this.playing.stop(fadeOutSec)
    this.playing = undefined
  }

  /**
   * Pause a sample at the current position.
   */
  public async pause () {
    if (this.playing != null) {
      await this.playing.pause()
    }
  }

  /**
   * Jump forwards.
   *
   * @param interval - Time interval in seconds.
   */
  public forward (interval: number = 10): void {
    if (this.playing != null) {
      this.playing.forward(interval)
    }
  }

  /**
   * Jump backwards.
   *
   * @param interval - Time interval in seconds.
   */
  public backward (interval: number = 10) {
    if (this.playing != null) {
      this.playing.backward(interval)
    }
  }

  /**
   * Toggle between `Player.pause()` and `Player.play()`. If a sample is loaded
   * start this sample.
   */
  public toggle () {
    if (this.playing != null) {
      this.playing.toggle(this.globalVolume)
    }
  }
}
