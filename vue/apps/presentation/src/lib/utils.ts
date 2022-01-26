/**
 * Various auxiliary functions.
 */

import { showMessage } from '@bldr/notification'

/**
 * Search for SVG files in the HTML DOM and warn if there are width or height
 * attributes set. With width and height attributes set, SVGs cannot be resized
 * easily in `<img>` tags. The slide preview depends on resizeable SVGs.
 *
 * @param filePath - The path of the SVG. The parameter is only used for better
 *   error messages.
 *
 * @throws Shows an error message if the attributes width or height are set.
 */
export function warnSvgWidthHeight (filePath?: string): void {
  const svgs = document.querySelectorAll('svg')
  for (const svg of svgs) {
    if (
      svg.attributes.getNamedItem('height') != null ||
      svg.attributes.getNamedItem('width') != null
    ) {
      if (filePath != null) {
        filePath = ` (${filePath})`
      } else {
        filePath = ''
      }
      showMessage.error(
        `SVG file${filePath} has width and height attributes set.`
      )
    }
  }
}
