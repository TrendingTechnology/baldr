/**
 * Base core functionality for the code running in the browser without node.
 *
 * Run `npm run build` to build the node version of this code. The node
 * version uses the CommonJS module system instead of the ES module system.
 *
 * @module @bldr/core-browser
 */

/* globals DOMParser */

/**
 * Select a subset of elements. Examples
 *
 * - `` (emtpy string or value which evalutes to false): All elements.
 * - `1`: The first element.
 * - `1,3,5`: The first, the third and the fifth element.
 * - `1-3,5-7`: `1,2,3,5,6,7`
 * - `-7`: All elements from the beginning up to `7` (`1-7`).
 * - `7-`: All elements starting from `7` (`7-end`).
 *
 * @typedef {String} subsetSelector
 */

/**
 * Select a subset of elements by a string (`subsetSelector`). `1` is the first
 * element of the `elements` array.
 *
 * @param {module:@bldr/core-browser~subsetSelector} subsetSelector - See above.
 * @param {object} options
 * @property {String|boolean} options.sort - `numeric`, or a truety value.
 * @property {Array} options.elements - An array of elements to build a subset
 *   from.
 * @property {Number} options.elementsCount - If `elements` is undefined, an
 *   array with integers is created und used as `elements`.
 * @property {Number} options.firstElementNo
 * @property {Number} options.shiftSelector - Shift all selector numbers by
 *   this number: For example `-1`: `2-5` is internally treated as `1-4`
 *
 * @returns {Array}
 */
export function selectSubset (subsetSelector, { sort, elements, elementsCount, firstElementNo, shiftSelector }) {
  const subset = []
  if (!shiftSelector) shiftSelector = 0

  // Create elements
  if (!elements && elementsCount) {
    elements = []
    let firstNo
    if (firstElementNo) {
      firstNo = firstElementNo
    } else {
      firstNo = 0
    }
    const endNo = firstNo + elementsCount
    for (let i = firstNo; i < endNo; i++) {
      elements.push(i)
    }
  }

  if (!subsetSelector) return elements

  // 1, 3, 5 -> 1,3,5
  subsetSelector = subsetSelector.replace(/\s*/g, '')
  // 1-3,5-7
  const ranges = subsetSelector.split(',')

  // for cloze steps: shiftSelector = -1
  // shiftSelectorAdjust = 1
  const shiftSelectorAdjust = -1 * shiftSelector
  for (let range of ranges) {
    // -7 -> 1-7
    if (range.match(/^-/)) {
      const end = parseInt(range.replace('-', ''))
      range = `${1 + shiftSelectorAdjust}-${end}`
    }

    // 7- -> 7-23
    if (range.match(/-$/)) {
      const begin = parseInt(range.replace('-', ''))
      // for cloze steps (shiftSelector: -1): 7- -> 7-23 -> elements.length
      // as 22 elements because 7-23 translates to 6-22.
      range = `${begin}-${elements.length + shiftSelectorAdjust}`
    }

    range = range.split('-')
    // 1
    if (range.length === 1) {
      const i = range[0]
      subset.push(elements[i - 1 + shiftSelector])
    // 1-3
    } else if (range.length === 2) {
      const beginNo = parseInt(range[0]) + shiftSelector
      const endNo = parseInt(range[1]) + shiftSelector
      if (endNo <= beginNo) {
        throw new Error(`Invalid range: ${beginNo}-${endNo}`)
      }
      for (let no = beginNo; no <= endNo; no++) {
        const index = no - 1
        subset.push(elements[index])
      }
    }
  }

  if (sort === 'numeric') {
    subset.sort((a, b) => a - b) // For ascending sort
  } else if (sort) {
    subset.sort()
  }

  return subset
}

/**
 * Sort alphabetically an array of objects by some specific properties.
 *
 * @param {String} property - Key of the object to sort.
 * @see {@link https://ourcodeworld.com/articles/read/764/how-to-sort-alphabetically-an-array-of-objects-by-key-in-javascript Tutorial}
 */
export function sortObjectsByProperty (property) {
  return function (a, b) {
    return a[property].localeCompare(b[property])
  }
}

/**
 * Format a date specification string into a local date string, for example
 * `28. August 1749`
 *
 * @param {String} dateSpec - A valid input for the `Date()` class. If the
 *   input is invalid the raw `dateSpec` is returned.
 *
 * @returns {String}
 */
export function formatToLocalDate (dateSpec) {
  const date = new Date(dateSpec)
  // Invalid date
  if (isNaN(date.getDay())) return dateSpec
  const months = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
  ]
  // Not getDay()
  return `${date.getDate()}. ${months[date.getMonth()]} ${date.getFullYear()}`
}

/**
 * Extract the 4 digit year from a date string
 *
 * @param {String} dateSpec - For example `1968-01-01`
 *
 * @returns {String} for example `1968`
 */
export function formatToYear (dateSpec) {
  return dateSpec.substr(0, 4)
}

/**
 * Format a timestamp into a string like this example: `Mo 17.2.2020 07:57:53`
 *
 * @param {Number} timeStampMsec - The timestamp in milliseconds.
 *
 * @returns {String}
 */
export function formatToLocalDateTime (timeStampMsec) {
  const date = new Date(Number(timeStampMsec))
  const dayNumber = date.getDay()
  let dayString
  if (dayNumber === 0) {
    dayString = 'So'
  } else if (dayNumber === 1) {
    dayString = 'Mo'
  } else if (dayNumber === 2) {
    dayString = 'Di'
  } else if (dayNumber === 3) {
    dayString = 'Mi'
  } else if (dayNumber === 4) {
    dayString = 'Do'
  } else if (dayNumber === 5) {
    dayString = 'Fr'
  } else if (dayNumber === 6) {
    dayString = 'Sa'
  }
  const dateString = date.toLocaleDateString()
  const timeString = date.toLocaleTimeString()
  return `${dayString} ${dateString} ${timeString}`
}

/**
 * Convert a duration string (8:01 = 8 minutes 1 seconds or 1:33:12 = 1 hour 33
 * minutes 12 seconds) into seconds.
 *
 * @param {String} duration
 *
 * @returns {Number}
 */
export function convertDurationToSeconds (duration) {
  if (typeof duration === 'string' && duration.match(/:/)) {
    const segments = duration.split(':')
    if (segments.length === 3) {
      return parseInt(segments[0]) * 3600 + parseInt(segments[1]) * 60 + parseInt(segments[2])
    } else if (segments.length === 2) {
      return  parseInt(segments[0]) * 60 + parseInt(segments[1])
    }
  }
  return Number.parseFloat(duration)
}

/**
 * Convert a single word into title case, for example `word` gets `Word`.
 *
 * @param {String} text
 *
 * @returns {String}
 */
export function toTitleCase (text) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/**
 * Get the plain text version of a HTML string.
 *
 * @param {String} html - A HTML formated string.
 *
 * @returns {String} The plain text version.
 */
export function plainText (html) {
  if (!html) return ''
  // To get spaces between heading and paragraphs
  html = html.replace(/></g, '> <')
  const markup = new DOMParser().parseFromString(html, 'text/html')
  return markup.body.textContent || ''
}

export default {
  convertDurationToSeconds,
}
