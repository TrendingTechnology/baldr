/**
 * Code which can shared in all parts of the app.
 *
 * @module @bldr/lamp/lib
 */

import vue from '@/main'

/**
 * Check if the input is a valid URI. Prefix with `ref:` if necessary.
 *
 * @param {String} uri -  The URI to validate.
 *
 * @returns {ExecFileSyncOptionsWithStringEncoding}
 */
export function validateUri (uri) {
  if (typeof uri !== 'string') throw new Error(`”${uri}“ is not a string.`)
  const segments = uri.split(':')
  // To allow URI with out a URI scheme. This defaults to `id`.
  if (segments.length === 1) {
    uri = `ref:${uri}`
  }
  return uri
}

/**
 * Hide the mouse after x seconds of inactivity.
 *
 * @param {Number} seconds
 */
export function hideMouseAfterSec (seconds = 5) {
  let mouseTimer = null
  let cursorVisible = true

  function disappearCursor () {
    mouseTimer = null
    document.body.style.cursor = 'none'
    cursorVisible = false
  }

  document.onmousemove = function () {
    if (mouseTimer) {
      window.clearTimeout(mouseTimer)
    }
    if (!cursorVisible) {
      document.body.style.cursor = 'default'
      cursorVisible = true
    }
    mouseTimer = window.setTimeout(disappearCursor, seconds * 1000)
  }
}

/**
 * Search for SVG files in the HTML tree and warn if there are width and
 * height attributes set. With width and height attributes SVGs could
 * not resized easily in IMG tags. The slide preview depends on resizeable
 * SVGs.
 *
 * @param {string} filePath - Path of the SVG. Only need for better error
 *   messages.
 */
export function warnSvgWidthHeight (filePath) {
  const svgs = document.querySelectorAll('svg')
  for (const svg of svgs) {
    if (svg.attributes.height || svg.attributes.width) {
      if (filePath) filePath = ` (${filePath})`
      vue.$showMessage.error(`SVG file${filePath} has width and height attributes set.`)
    }
  }
}
