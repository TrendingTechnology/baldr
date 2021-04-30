/**
 * Code which can shared in all parts of the app.
 *
 * @module @bldr/lamp/lib
 */

import vue from '@/main.js'
import { convertMarkdownToHtml } from '@bldr/markdown-to-html'

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

export async function openPresentationByRawYaml (rawYamlString) {
  vue.$media.player.stop()
  vue.$store.dispatch('media/clear')
  await vue.$store.dispatch('lamp/openPresentation', { rawYamlString })
  if (vue.$route.name !== 'slide') {
    vue.$router.push({ name: 'slide' })
  }
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
 * Grab / select values from two objects. The first object is preferred. The
 * first object can be for example props and the second a object from the media
 * server.
 */
export class GrabFromObjects {
  /**
   * @param {Object} object1
   * @param {Object} object2
   * @param {Boolean} markup - Apply `convertMarkdownToHtml()` to the values of the
   *   second object.
   */
  constructor (object1, object2, markup = true) {
    this.object1 = object1
    this.object2 = object2
    this.markup = markup
  }

  /**
   * Grab a value from two objects.
   *
   * @param {String} property - The name of property to look for
   * @returns {Mixed}
   */
  property (property) {
    if (this.object1[property]) return this.object1[property]
    if (this.object2 && this.object2[property]) {
      if (this.markup) {
        return convertMarkdownToHtml(this.object2[property])
      } else {
        return this.object2[property]
      }
    }
  }

  /**
   * Grab multiple properties.
   *
   * @param {Array} properties - An array of property names.
   *
   * @returns {object} - A new object containing the key and value pairs.
   */
  multipleProperties (properties) {
    const result = {}
    for (const property of properties) {
      const value = this.property(property)
      if (value) result[property] = value
    }
    return result
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
      vue.$notifyError(`SVG file${filePath} has width and height attributes set.`)
    }
  }
}
