/**
 * Code which can shared in all parts of the app.
 *
 * @module @bldr/lamp/lib
 */

/* globals DOMParser */

import marked from 'marked'
import vue from '@/main.js'

/**
 * Convert the specifed text to HTML. At the moment Markdown and HTML formats
 * are supported. The conversion is done in a recursive fashion, that means
 * nested strings are also converted.
 *
 * @param {String|Array|Object} input - Convert the specifed input.
 *
 * @returns {String}
 */
export function markupToHtml (input) {
  /**
   * @param {String} text - The raw input text coming directly form YAML
   *
   * @returns {String}
   */
  function convertCustomMarkup (text) {
    return text
      // ↔ 8596 2194 &harr; LEFT RIGHT ARROW
      .replace(/<->/g, '↔')
      // → 8594 2192 &rarr; RIGHTWARDS ARROW
      .replace(/->/g, '→')
      // ← 8592 2190 &larr; LEFTWARDS ARROW
      .replace(/<-/g, '←')
  }

  /**
   * Maybe long texts are not converted? Had to use marked() function in editor.
   * Surpress wrapping in <p> tag.
   * Other no so stable solution: https://github.com/markedjs/marked/issues/395
   *
   * @param {String} text - The raw input text coming directly form YAML
   *
   * @returns {String}
   */
  function convertMarkdown (text) {
    text = marked(text)
    const dom = new DOMParser().parseFromString(text, 'text/html')
    if (dom.body.childElementCount === 1 && dom.body.childNodes[0].tagName === 'P') {
      return dom.body.childNodes[0].innerHTML
    } else {
      return dom.body.innerHTML
    }
  }

  /**
   * Wrapper function for various string convert functions
   *
   * @param {String} text - The raw input text coming directly form YAML
   *
   * @returns {String}
   */
  function convertString (text) {
    return convertMarkdown(convertCustomMarkup(text))
  }

  // string
  if (typeof input === 'string') {
    return convertString(input)

  // array
  } else if (Array.isArray(input)) {
    for (let index = 0; index < input.length; index++) {
      const value = input[index]
      if (typeof value === 'string') {
        input[index] = convertString(value)
      } else {
        markupToHtml(value)
      }
    }

  // object
  } else if (typeof input === 'object') {
    for (const key in input) {
      const value = input[key]
      if (typeof value === 'string') {
        input[key] = convertString(value)
      } else {
        markupToHtml(value)
      }
    }
  }
  return input
}

/**
 * Check if the input is a valid URI. Prefix with `id:` if necessary.
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
    uri = `id:${uri}`
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
 * Grab / select values from two objects. The first object is preferred. The
 * first object can be for example props and the second a object from the media
 * server.
 */
export class GrabFromObjects {
  /**
   * @param {Object} object1
   * @param {Object} object2
   * @param {Boolean} markup - Apply `markupToHtml()` to the values of the
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
    if (this.object2[property]) {
      if (this.markup) {
        return markupToHtml(this.object2[property])
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
