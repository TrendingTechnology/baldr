import { Sample } from '@bldr/media-resolver'

import { TimeOutExecutor, IntervalExecutor } from './timer'
import { EventsListenerStore } from './events'
import { Player } from './player'

const TIME_UPDATE_INTERVAL: number = 10

export interface PlaybackOptions {
  startTimeSec?: number

  /**
   * Number from 0 - 1
   */
  startProgress?: number

  /**
   * Number from 0 - 1
   */
  targetVolume?: number

  fadeInSec?: number
}

/**
 * The state of the current playback.
 */
export type PlaybackState = 'fadein' | 'playing' | 'fadeout' | 'stopped'

type JumpDirection = 'forward' | 'backward'

export class Playable {
  public sample: Sample
  public htmlElement: HTMLMediaElement

  public currentVolume: number = 1

  public lastPositionSec?: number

  private readonly intervalExecutor = new IntervalExecutor()

  private timeUpdateIntervalId?: ReturnType<typeof setInterval>

  private readonly timeOutExecutor = new TimeOutExecutor()

  private readonly eventsListener = new EventsListenerStore()

  private playbackState_: PlaybackState = 'stopped'

  public player: Player

  constructor (sample: Sample, htmlElement: HTMLMediaElement, player: Player) {
    this.sample = sample
    this.htmlElement = htmlElement
    this.player = player
  }

  /**
   * The playback states of a playable are:
   *
   * - `fadein`: during the fade in process.
   * - `playing`: The playable is being played at the target volume.
   * - `fadeout`: during the fade out process.
   * - `stopped`: The playable is not played after the fade out process finishes.
   */
  get playbackState (): PlaybackState {
    return this.playbackState_
  }

  set playbackState (value: PlaybackState) {
    this.playbackState_ = value
    this.eventsListener.trigger('playback-change', value)
  }

  public get isPlaying (): boolean {
    return this.playbackState !== 'stopped'
  }

  public registerPlaybackChangeListener (
    callback: (state: PlaybackState) => void
  ): void {
    this.eventsListener.register('playback-change', callback)
  }

  public registerTimeUpdateListener (
    callback: (playable: Playable) => void
  ): void {
    this.eventsListener.register('time-update', callback)
  }

  public removeEventsListener (callback: Function): void {
    this.eventsListener.remove(callback)
  }

  private triggerTimeUpdateListener (): void {
    this.eventsListener.trigger('time-update', this)
  }

  /**
   * The played time of the sample.
   */
  public get elapsedTimeSec (): number {
    return this.htmlElement.currentTime - this.sample.startTimeSec
  }

  /**
   * The remaining time of the sample.
   */
  public get remainingTimeSec (): number {
    return this.durationSec - this.elapsedTimeSec
  }

  /**
   * The duration of the sample.
   */
  public get durationSec (): number {
    if (this.sample.durationSec != null) {
      return this.sample.durationSec
    } else {
      return this.htmlElement.duration - this.sample.startTimeSec
    }
  }

  /**
   * for example:
   * current time: 6s duration: 60s
   * 6 / 60 = 0.1
   */
  public get progress (): number {
    return this.elapsedTimeSec / this.durationSec
  }

  /**
   * Set the value to 0 to start playing from the start. 1 set the position at
   * the end.
   */
  public set progress (value: number) {
    this.jumpTo(this.calculateStartTimeSecFromProgress(value))
  }

  public get volume (): number {
    return this.htmlElement.volume
  }

  /**
   * Set the volume and simultaneously the opacity of a video element, to be
   * able to fade out or fade in a video and a audio file.
   */
  public set volume (value: number) {
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
    if (fadeInDuration === undefined) {
      fadeInSec = this.sample.fadeInSec
    } else {
      fadeInSec = fadeInDuration
    }

    return await new Promise((resolve, reject) => {
      // Fade in can triggered when a fade out process is started and
      // not yet finished.
      this.intervalExecutor.clear()
      this.playbackState = 'fadein'
      let actualVolume = 0
      this.htmlElement.volume = 0
      if (this.timeUpdateIntervalId == null) {
        this.timeUpdateIntervalId = setInterval(() => {
          this.triggerTimeUpdateListener()
        }, TIME_UPDATE_INTERVAL)
      }
      this.htmlElement.play().then(
        () => {
          // Normally 0.01 by volume = 1
          const steps = targetVolume / 100
          // Interval: every X ms increase volume by step
          // in milliseconds: duration * 1000 / 100
          const stepInterval = fadeInSec * 10
          this.intervalExecutor.set(() => {
            actualVolume += steps
            if (actualVolume <= targetVolume) {
              this.volume = actualVolume
            } else {
              this.intervalExecutor.clear()
              this.volume = targetVolume
              this.playbackState = 'playing'
              resolve()
            }
          }, stepInterval)
        },
        () => {}
      )
    })
  }

  private calculateStartTimeSecFromProgress (process: number): number {
    if (process < 0 || process > 1) {
      throw new Error(
        'The property “progress” of the class “Playable” can only be between 0 und 1!'
      )
    }
    return this.sample.startTimeSec + this.durationSec * process
  }

  /**
   * Play a sample from the beginning.
   */
  public start (options?: PlaybackOptions): void {
    if (options == null) {
      options = {}
    }
    if (options.startTimeSec == null && options.startProgress == null) {
      options.startTimeSec = this.sample.startTimeSec
    }
    this.initializePlayback(options)
  }

  /**
   * Play a sample from the last position.
   */
  public play (options?: PlaybackOptions): void {
    if (options == null) {
      options = {}
    }
    this.initializePlayback(options)
  }

  private initializePlayback ({
    startProgress,
    targetVolume,
    startTimeSec,
    fadeInSec
  }: PlaybackOptions): void {
    if (fadeInSec == null) {
      fadeInSec = this.sample.fadeInSec
    }
    if (startTimeSec != null && startProgress != null) {
      throw new Error(
        `${this.sample.ref}: Playback options: Specify either startTimeSec or startProgress`
      )
    }

    if (startProgress != null) {
      startTimeSec = this.calculateStartTimeSecFromProgress(startProgress)
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

    this.fadeIn(targetVolume, fadeInSec).then(
      () => {},
      () => {}
    )
    this.scheduleFadeOut()
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
    }, (this.remainingTimeSec - this.sample.fadeOutSec) * 1000)
  }

  private async fadeOut (fadeOutDuration?: number): Promise<void> {
    let fadeOutSec: number
    if (fadeOutDuration == null) {
      fadeOutSec = this.sample.fadeOutSec
    } else {
      fadeOutSec = fadeOutDuration
    }

    return await new Promise((resolve, reject) => {
      if (this.htmlElement.paused) {
        resolve(undefined)
      }
      // Fade out can triggered when a fade out process is started and
      // not yet finished.
      this.intervalExecutor.clear()
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
          if (this.timeUpdateIntervalId != null) {
            clearInterval(this.timeUpdateIntervalId)
          }
          this.timeUpdateIntervalId = undefined
          this.htmlElement.pause()
          this.intervalExecutor.clear()
          this.triggerTimeUpdateListener()
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

  public toggle (): void {
    if (this.htmlElement.paused) {
      this.initializePlayback({})
    } else {
      this.pause().then(
        () => {},
        () => {}
      )
    }
  }

  /**
   * Jump to a new position while the playable is playing.
   *
   * @param timeSec - Current time in seconds. O is `sample.startTimeSec`.
   */
  private jumpTo (timeSec: number): void {
    this.timeOutExecutor.clear()
    this.htmlElement.currentTime = this.sample.startTimeSec + timeSec
    this.scheduleFadeOut()
  }

  /**
   * Jump to a new time position.
   */
  private jumpByInterval (
    interval: number = 10,
    direction: JumpDirection = 'forward'
  ): void {
    let newPlayPosition
    if (direction === 'backward') {
      if (this.elapsedTimeSec - interval > 0) {
        newPlayPosition = this.elapsedTimeSec - interval
      } else {
        newPlayPosition = 0
      }
    } else {
      newPlayPosition = this.elapsedTimeSec + interval
      if (this.elapsedTimeSec + interval < this.durationSec) {
        newPlayPosition = this.elapsedTimeSec + interval
      } else {
        newPlayPosition = this.durationSec
      }
    }
    this.jumpTo(newPlayPosition)
  }

  public forward (interval: number = 10): void {
    this.jumpByInterval(interval, 'forward')
  }

  public backward (interval: number = 10): void {
    this.jumpByInterval(interval, 'backward')
  }

  /**
   * „abwürgen“
   */
  public stall (): void {
    this.timeOutExecutor.clear()
    this.intervalExecutor.clear()
    if (this.timeUpdateIntervalId != null) {
      clearInterval(this.timeUpdateIntervalId)
    }
    this.timeUpdateIntervalId = undefined
    this.htmlElement.pause()
  }
}
