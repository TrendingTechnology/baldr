import { Sample } from '@bldr/media-resolver-ng'
// import { CustomEventsManager } from './events'
// import { Interval, TimeOut } from './timer'

export class PlayableSample {
  sample: Sample
  constructor (sample: Sample) {
    this.sample = sample
  }
}

// export class PlayableSample {
//   sample: Sample
//   htmlElement: HTMLMediaElement

//   /**
//    * The current time of the parent media Element. This value gets stored
//    * when the sample is paused.
//    */
//   private htmlElementCurrentTimeSec: number = 0

//   startTimeSec: number = 0

//   /**
//    * Use the getter functions `sample.durationSec`.
//    */
//   private readonly durationSec_?: number

//   /**
//    * Use the getter function `sample.fadeInSec`
//    */
//   private readonly fadeInSec_?: number

//   /**
//    * Use the getter function `sample.fadeOutSec`
//    */
//   private readonly fadeOutSec_?: number

//   shortcut?: string

//   private readonly interval = new Interval()

//   private readonly timeOut = new TimeOut()

//   private readonly events = new CustomEventsManager()

//   playbackState: MediaResolverTypes.PlaybackState

//   constructor (sample: Sample) {
//     this.sample = sample

//     this.yaml = yaml

//     if (this.yaml.ref == null) {
//       this.yaml.ref = 'complete'
//     }

//     this.htmlElement = createHtmlElement(
//       asset.mimeType,
//       asset.httpUrl
//     ) as HTMLMediaElement

//     sampleShortcutManager.addShortcut(this)
//     this.interval = new Interval()
//     this.timeOut = new TimeOut()
//     this.events = new CustomEventsManager()
//     this.playbackState = 'stopped'
//   }

//   get currentTimeSec (): number {
//     return this.htmlElement.currentTime - this.startTimeSec
//   }

//   /**
//    * In how many milliseconds we have to start a fade out process.
//    */
//   private get fadeOutStartTimeMsec (): number {
//     return (this.durationRemainingSec - this.fadeOutSec) * 1000
//   }

//   get durationSec (): number {
//     if (this.durationSec_ == null) {
//       // Samples without duration play until the end fo the media file.
//       return this.htmlElement.duration - this.startTimeSec
//     }
//     return this.durationSec_
//   }

//   get durationRemainingSec (): number {
//     return this.durationSec - this.currentTimeSec
//   }

//   get progress (): number {
//     // for example:
//     // current time: 6s duration: 60s
//     // 6 / 60 = 0.1
//     return this.currentTimeSec / this.durationSec
//   }

//   get volume (): number {
//     return this.htmlElement.volume
//   }

//   /**
//    * Set the volume and simultaneously the opacity of a video element, to be
//    * able to fade out or fade in a video and a audio file.
//    */
//   set volume (value: number) {
//     this.htmlElement.volume = parseFloat(value.toFixed(2))
//     if (this.asset.mimeType === 'video') {
//       this.htmlElement.style.opacity = value.toFixed(2)
//     }
//   }

//   async fadeIn (targetVolume: number = 1, duration?: number): Promise<void> {
//     let durationSafe: number
//     if (duration == null) {
//       durationSafe = defaultFadeInSec
//     } else {
//       durationSafe = duration
//     }
//     return await new Promise((resolve, reject) => {
//       // Fade in can triggered when a fade out process is started and
//       // not yet finished.
//       this.interval.clear()
//       this.events.trigger('fadeinbegin')
//       this.playbackState = 'fadein'
//       let actualVolume = 0
//       this.htmlElement.volume = 0
//       this.htmlElement.play().then(
//         () => {},
//         () => {}
//       )
//       // Normally 0.01 by volume = 1
//       const steps = targetVolume / 100
//       // Interval: every X ms reduce volume by step
//       // in milliseconds: duration * 1000 / 100
//       const stepInterval = durationSafe * 10
//       this.interval.set(() => {
//         actualVolume += steps
//         if (actualVolume <= targetVolume) {
//           this.volume = actualVolume
//         } else {
//           this.interval.clear()
//           this.events.trigger('fadeinend')
//           this.playbackState = 'playing'
//           resolve()
//         }
//       }, stepInterval)
//     })
//   }

//   start (targetVolume: number): void {
//     this.playbackState = 'started'
//     this.play(targetVolume, this.startTimeSec)
//   }

//   play (targetVolume: number, startTimeSec?: number, fadeInSec?: number): void {
//     if (fadeInSec == null) fadeInSec = this.fadeInSec
//     // The start() triggers play with this.startTimeSec. “complete” samples
//     // have on this.startTimeSec 0.
//     if (startTimeSec != null || startTimeSec === 0) {
//       this.htmlElement.currentTime = startTimeSec
//     } else if (this.htmlElementCurrentTimeSec != null) {
//       this.htmlElement.currentTime = this.htmlElementCurrentTimeSec
//     } else {
//       this.htmlElement.currentTime = this.startTimeSec
//     }

//     // To prevent AbortError in Firefox, artefacts when switching through the
//     // audio files.
//     this.timeOut.set(() => {
//       this.fadeIn(targetVolume, this.fadeInSec).then(
//         () => {},
//         () => {}
//       )
//       this.scheduleFadeOut()
//     }, defaultPlayDelayMsec)
//   }

//   /**
//    * Schedule when the fade out process has to start.
//    * Always fade out at the end. Maybe the samples are cut without a
//    * fade out.
//    */
//   private scheduleFadeOut (): void {
//     this.timeOut.set(() => {
//       this.fadeOut(this.fadeOutSec).then(
//         () => {},
//         () => {}
//       )
//     }, this.fadeOutStartTimeMsec)
//   }

//   async fadeOut (duration?: number): Promise<void> {
//     let durationSafe: number
//     if (duration == null) {
//       durationSafe = defaultFadeOutSec
//     } else {
//       durationSafe = duration
//     }
//     return await new Promise((resolve, reject) => {
//       if (this.htmlElement.paused) resolve(undefined)
//       // Fade out can triggered when a fade out process is started and
//       // not yet finished.
//       this.interval.clear()
//       this.events.trigger('fadeoutbegin')
//       this.playbackState = 'fadeout'
//       // Number from 0 - 1
//       let actualVolume = this.htmlElement.volume
//       // Normally 0.01 by volume = 1
//       const steps = actualVolume / 100
//       // Interval: every X ms reduce volume by step
//       // in milliseconds: duration * 1000 / 100
//       const stepInterval = durationSafe * 10
//       this.interval.set(() => {
//         actualVolume -= steps
//         if (actualVolume >= 0) {
//           this.volume = actualVolume
//         } else {
//           // The video opacity must be set to zero.
//           this.volume = 0
//           if (this.htmlElement != null) this.htmlElement.pause()
//           this.interval.clear()
//           this.events.trigger('fadeoutend')
//           this.playbackState = 'stopped'
//           resolve()
//         }
//       }, stepInterval)
//     })
//   }

//   async stop (fadeOutSec?: number): Promise<void> {
//     if (this.htmlElement.paused) return
//     await this.fadeOut(fadeOutSec)
//     this.htmlElement.currentTime = this.startTimeSec
//     this.timeOut.clear()
//     if (this.asset.mimeType === 'video') {
//       this.htmlElement.load()
//       this.htmlElement.style.opacity = '1'
//     }
//   }

//   async pause (): Promise<void> {
//     await this.fadeOut()
//     this.timeOut.clear()
//     if (this.asset.mimeType === 'video') {
//       this.htmlElement.style.opacity = '0'
//     }
//     this.htmlElementCurrentTimeSec = this.htmlElement.currentTime
//     this.htmlElementCurrentVolume = this.htmlElement.volume
//   }

//   toggle (targetVolume: number = 1): void {
//     if (this.htmlElement.paused) {
//       this.play(targetVolume)
//     } else {
//       this.pause().then(
//         () => {},
//         () => {}
//       )
//     }
//   }

//   /**
//    * Jump to a new time position.
//    */
//   private jump (
//     interval: number = 10,
//     direction: JumpDirection = 'forward'
//   ): void {
//     let newPlayPosition
//     const cur = this.currentTimeSec
//     if (direction === 'backward') {
//       if (cur - interval > 0) {
//         newPlayPosition = cur - interval
//       } else {
//         newPlayPosition = 0
//       }
//     } else {
//       newPlayPosition = this.currentTimeSec + interval
//       if (cur + interval < this.durationSec) {
//         newPlayPosition = cur + interval
//       } else {
//         newPlayPosition = this.durationSec
//       }
//     }
//     this.timeOut.clear()
//     this.htmlElement.currentTime = this.startTimeSec + newPlayPosition
//     this.scheduleFadeOut()
//   }

//   forward (interval: number = 10): void {
//     this.jump(interval, 'forward')
//   }

//   backward (interval: number = 10): void {
//     this.jump(interval, 'backward')
//   }
// }
