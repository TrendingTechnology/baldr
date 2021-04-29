// <- const jsdom = require("jsdom")
// <- const { JSDOM } = jsdom
// <- const dom = new JSDOM('<!DOCTYPE html><p>dummpy</p>')
// <- const Image = dom.window.Image
// <- const Audio = dom.window.Audio
// <- const document = dom.window.document

export function createMediaElement (mimeType: string, httpUrl: string, previewHttpUrl?: string): HTMLElement {
  switch (mimeType) {
    case 'audio':
      return new Audio(httpUrl)

    case 'video':
      const video = document.createElement('video')
      video.src = httpUrl
      video.controls = true
      if (previewHttpUrl != null) {
        video.poster = previewHttpUrl
      }
      return video

    case 'image':
      const image = new Image()
      image.src = httpUrl
      return image

    default:
      throw new Error(`Not supported asset type “${mimeType}”.`)
  }
}
