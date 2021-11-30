// import { CustomEventsManager } from './events'
// import { Interval, TimeOut } from './timer'
import { Sample, Cache, Resolver } from '@bldr/media-resolver-ng'

function createHtmlElement (
  mimeType: string,
  httpUrl: string,
  previewHttpUrl?: string
): HTMLElement {
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
  } else if (mimeType === 'image') {
    const image = new Image()
    image.src = httpUrl
    return image
  } else {
    throw new Error(`Not supported asset type “${mimeType}”.`)
  }
}

class Playable {
  sample: Sample
  htmlElement: HTMLElement
  constructor (sample: Sample, htmlElement: HTMLElement) {
    this.sample = sample
    this.htmlElement = htmlElement
  }
}

class HtmlElementCache extends Cache<HTMLElement> {}

class PlayableCache extends Cache<Playable> {}

export class PlayerCache {
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
