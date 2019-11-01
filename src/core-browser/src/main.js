/**
 * Base core functionality for the code running in the browser without node.
 * @module @bldr/core-browser
 */

/**
 *
 * @param {Number} timeStampMsec
 * @return {String}
 */
export function toLocaleDateTimeString (timeStampMsec) {
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
 *
 * @param {String} html
 *
 * @return {String}
 */
export function plainText (html) {
  // To get spaces between heading and paragraphs
  html = html.replace(/></g, '> <')
  const markup = new DOMParser().parseFromString(html, 'text/html')
  return markup.body.textContent || ''
}

/**
 * @param {String} text
 * @param {Object} options
 *
 * @return {String}
 */
export function shortenText (text, options = {}) {
  if (!text) return ''
  let { maxLength, stripTags } = options
  if (!maxLength) maxLength = 80
  if (stripTags) text = plainText(text)
  // https://stackoverflow.com/a/5454303
  // trim the string to the maximum length
  text = text.substr(0, maxLength);
  // re-trim if we are in the middle of a word
  text = text.substr(0, Math.min(text.length, text.lastIndexOf(' ')))
  return `${text} …`
}

/**
 * @param {String} str - A snake or kebab cased string
 *
 * @returns {String}
 *
 * @see {@link https://catalin.me/javascript-snake-to-camel/}
 */
export function snakeToCamel (str) {
  str.replace(
    /([-_][a-z])/g,
    (group) => group.toUpperCase()
                    .replace('-', '')
                    .replace('_', '')
  )
}
