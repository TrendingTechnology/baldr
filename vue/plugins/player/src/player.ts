import { Cache, Resolver } from '@bldr/media-resolver'

import { Playable, PlaybackState, PlaybackOptions } from './playable'
import { EventsListenerStore } from './events'

interface PlayerStartOptions extends PlaybackOptions {
  uri?: string
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
  }
  throw new Error(`Not supported mime type “${mimeType}”.`)
}

class HtmlElementCache extends Cache<HTMLMediaElement> {}

class PlayableCache extends Cache<Playable> {}

class PlayerCache {
  htmlElements: HtmlElementCache
  playables: PlayableCache
  resolver: Resolver
  player: Player

  constructor (resolver: Resolver, player: Player) {
    this.htmlElements = new HtmlElementCache()
    this.playables = new PlayableCache()
    this.resolver = resolver
    this.player = player
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
        sample.asset.httpUrl,
        sample.asset.previewHttpUrl
      )
      this.htmlElements.add(sample.asset.ref, htmlElement)
    }

    playable = new Playable(sample, htmlElement, this.player)
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
  public events: EventsListenerStore
  private readonly cache: PlayerCache
  public resolver: Resolver

  /**
   * Can be used as data `data () { return player.data }` in Vue components.
   * A puremans vuex store.
   */
  public data: { loadedUri?: string; playingUri?: string } = {
    loadedUri: undefined,
    playingUri: undefined
  }

  /**
   * Global volume: from 0 - 1
   */
  globalVolume: number = 1

  constructor (resolver: Resolver) {
    this.resolver = resolver
    this.events = new EventsListenerStore()
    this.cache = new PlayerCache(resolver, this)
  }

  public get isLoaded (): boolean {
    return this.loaded != null
  }

  public get isPlaying (): boolean {
    return this.playing != null && this.playing.isPlaying
  }

  /**
   * True if a new playable is loaded and the old playable is still playing.
   */
  public get isNewLoaded (): boolean {
    if (
      this.loaded != null &&
      this.playing != null &&
      this.loaded.sample.ref !== this.playing.sample.ref
    ) {
      return true
    }
    return false
  }

  public getPlayable (uri: string): Playable {
    return this.cache.getPlayable(uri)
  }

  public async resolvePlayable (uri: string): Promise<Playable> {
    await this.resolver.resolve(uri)
    return this.getPlayable(uri)
  }

  /**
   * Load a sample. Only loaded samples can be played.
   */
  public load (uri: string): void {
    this.loaded = this.cache.getPlayable(uri)
    this.data.loadedUri = uri
  }

  /**
   * Play a loaded sample from the position `sample.startTimeSec` on. Stop the
   * currently playing sample.
   */
  public async start (options?: PlayerStartOptions): Promise<void> {
    if (options == null) {
      options = {}
    }
    if (options.uri != null) {
      this.load(options.uri)
    }
    if (this.loaded == null) {
      throw new Error('First load a sample')
    }
    this.events.trigger('fadeinbegin', this.loaded)
    if (this.playing != null) {
      await this.playing.stop()
    }

    if (options.targetVolume == null) {
      options.targetVolume = this.globalVolume
    }
    this.loaded.start(options)
    this.playing = this.loaded
    this.playing.registerPlaybackChangeListener((state: PlaybackState) => {
      if (state === 'stopped') {
        this.playing = undefined
        this.data.playingUri = undefined
      }
    })
    this.data.playingUri = this.data.loadedUri
  }

  /**
   * Stop the playback and reset the play position to `sample.startTimeSec` and
   * unload the playing sample.
   *
   * @param fadeOutSec - Duration in seconds to fade out the sample.
   */
  public async stop (fadeOutSec?: number): Promise<void> {
    if (this.playing == null) {
      return
    }
    await this.playing.stop(fadeOutSec)
    this.playing = undefined
    this.data.playingUri = undefined
  }

  public play (options?: PlaybackOptions) {
    if (this.playing == null) {
      return
    }
    this.playing.play(options)
  }

  /**
   * Pause a sample at the current position.
   */
  public async pause (): Promise<void> {
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
  public backward (interval: number = 10): void {
    if (this.playing != null) {
      this.playing.backward(interval)
    }
  }

  /**
   * Toggle between `Player.pause()` and `Player.play()`. If a sample is loaded
   * start this sample.
   */
  public toggle (): void {
    if (this.playing != null) {
      this.playing.toggle()
    }
  }
}
