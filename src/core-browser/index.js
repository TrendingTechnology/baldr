/**
 * @module @bldr/core-browser
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

export function plainText (text) {
  // const markup = new DOMParser().parseFromString(text, 'text/html')
  // return markup.body.textContent || ''

  // https://stackoverflow.com/a/5002157
  const div = document.createElement('div')
  div.innerHTML = text
  return div.innerText
}

export function shortenText (text, { maxLength, stripTags } ) {
  if (!maxLength) maxLength = 48
  if (stripTags) text = plainText(text)
  // https://stackoverflow.com/a/5454303
  // trim the string to the maximum length
  var trimmedString = text.substr(0, maxLength);
  // re-trim if we are in the middle of a word
  return trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")))
}
