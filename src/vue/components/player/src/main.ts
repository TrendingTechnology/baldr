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

class PlayableSample {
  sample: Sample
  htmlElement: HTMLElement
  constructor (sample: Sample, htmlElement: HTMLElement) {
    this.sample = sample
    this.htmlElement = htmlElement
  }
}

class HtmlElementCache extends Cache<HTMLElement> {}

class PlayableSampleCache extends Cache<PlayableSample> {}

export class PlayerCache {
  htmlElements: HtmlElementCache
  playableSamples: PlayableSampleCache
  resolver: Resolver

  constructor (resolver: Resolver) {
    this.htmlElements = new HtmlElementCache()
    this.playableSamples = new PlayableSampleCache()
    this.resolver = resolver
  }

  getPlayableSample (uri: string): PlayableSample {
    const sample = this.resolver.getSample(uri)
    let htmlElement = this.htmlElements.get(sample.asset.ref)
    if (htmlElement == null) {
      htmlElement = createHtmlElement(
        sample.asset.mimeType,
        sample.asset.httpUrl
      )
      this.htmlElements.add(sample.asset.ref, htmlElement)
    }

    let playableSample = this.playableSamples.get(sample.ref)
    if (playableSample == null) {
      playableSample = new PlayableSample(sample, htmlElement)
      this.playableSamples.add(sample.ref, playableSample)
    }
    return playableSample
  }
}
