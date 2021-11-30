export function createHtmlElement (mimeType: string, httpUrl: string, previewHttpUrl?: string): HTMLElement {
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
