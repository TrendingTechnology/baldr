export function embedSvgInline (url: string, id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest()
    request.open('GET', url, false)
    // Following line is just to be on the safe side;
    // not needed if your server delivers SVG with correct MIME type
    request.overrideMimeType('image/svg+xml')
    request.onload = function (e) {
      if (request.readyState !== 4) {
        reject(`Not ready ${url}`)
      }
      if (request.status !== 200) {
        reject(`Failed to load ${url}`)
      }
      if (request.responseXML != null) {
        document
          .getElementById(id)
          ?.appendChild(request.responseXML.documentElement)
        resolve()
      }
    }
    request.send('')
  })
}
