/**
 * Code which can shared in all parts of the app.
 *
 * @module @bldr/lamp/lib
 */

import { showMessage } from '@bldr/notification'

/**
 * Check if the input is a valid URI. Prefix with `ref:` if necessary.
 *
 * @param {String} uri -  The URI to validate.
 *
 * @returns {ExecFileSyncOptionsWithStringEncoding}
 */
export function validateUri (uri: string) {
  if (typeof uri !== 'string') throw new Error(`”${uri}“ is not a string.`)
  const segments = uri.split(':')
  // To allow URI with out a URI scheme. This defaults to `id`.
  if (segments.length === 1) {
    uri = `ref:${uri}`
  }
  return uri
}

/**
 * Search for SVG files in the HTML tree and warn if there are width and
 * height attributes set. With width and height attributes SVGs could
 * not resized easily in IMG tags. The slide preview depends on resizeable
 * SVGs.
 *
 * @param filePath - Path of the SVG. Only need for better error
 *   messages.
 */
export function warnSvgWidthHeight (filePath?: string): void {
  const svgs = document.querySelectorAll('svg') as NodeListOf<SVGSVGElement>
  for (const svg of svgs) {
    if (
      svg.attributes.getNamedItem('height') != null ||
      svg.attributes.getNamedItem('width') != null
    ) {
      if (filePath != null) {
        filePath = ` (${filePath})`
      }
      showMessage.error(
        `SVG file${filePath} has width and height attributes set.`
      )
    }
  }
}
