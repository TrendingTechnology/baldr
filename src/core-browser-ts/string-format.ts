
/**
 * Escape some characters with HTML entities.
 *
 * @see {@link https://coderwall.com/p/ostduq/escape-html-with-javascript}
 */
export function escapeHtml (htmlString: string): string {
  // List of HTML entities for escaping.
  const htmlEscapes: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
  }

  // Regex containing the keys listed immediately above.
  const htmlEscaper = /[&<>"'/]/g

  // Escape a string for HTML interpolation.
  return ('' + htmlString).replace(htmlEscaper, function (match) {
    return htmlEscapes[match]
  })
}

/**
 * Generate from the file name or the url of the first element of a
 * multipart asset the nth file name or the url. The parameter
 * `firstFileName` must have a extension (for example `.jpg`). The
 * parameter `no` must be smaller then 100. Only two digit or smaller
 * integers are allowed.
 *
 * 1. `multipart-asset.jpg`
 * 2. `multipart-asset_no02.jpg`
 * 3. `multipart-asset_no03.jpg`
 * 4. ...
 *
 * @param firstFileName - A file name, a path or a URL.
 * @param no - The number in the multipart asset list. The
 *   first element has the number 1.
 */
export function formatMultiPartAssetFileName (firstFileName: string, no: string | number): string {
  if (!Number.isInteger(no)) {
    // throw new Error(`${firstFileName}: The specifed number “${no}” is no integer.`)
    no = 1
  }
  let suffix
  if (no === 1) {
    return firstFileName
  } else if (no < 10) {
    suffix = `_no00${no}`
  } else if (no < 100) {
    suffix = `_no0${no}`
  } else if (no < 1000) {
    suffix = `_no${no}`
  } else {
    throw new Error(`${firstFileName} multipart asset counts greater than 100 are not supported.`)
  }
  return firstFileName.replace(/(\.\w+$)/, `${suffix}$1`)
}

/**
 * Format a Wikidata URL.
 * `https://www.wikidata.org/wiki/Q42`
 */
export function formatWikidataUrl (id: string): string {
  id = String(id)
  const idNumber: number = parseInt(id.replace(/^Q/, ''))
  // https://www.wikidata.org/wiki/Q42
  return `https://www.wikidata.org/wiki/Q${idNumber}`
}

/**
 * Format a Wikipedia URL.
 *
 * https://en.wikipedia.org/wiki/A_Article
 *
 * @param nameSpace - The name space of the Wikipedia article (for
 *   example A_Article or en:A_article)
 */
export function formatWikipediaUrl (nameSpace: string): string {
  // https://de.wikipedia.org/wiki/Gesch%C3%BCtztes_Leerzeichen
  // https://en.wikipedia.org/wiki/Non-breaking_space
  const segments = nameSpace.split(':')
  const lang = segments[0]
  const slug = encodeURIComponent(segments[1])
  return `https://${lang}.wikipedia.org/wiki/${slug}`
}

/**
 * Format a Musicbrainz recording URL.
 *
 * `https://musicbrainz.org/recording/${RecordingId}`
 *
 * @param recordingId
 */
export function formatMusicbrainzRecordingUrl (recordingId: string): string {
  return `https://musicbrainz.org/recording/${recordingId}`
}

/**
 * Format a Musicbrainz work URL.
 *
 * `https://musicbrainz.org/work/${WorkId}`
 *
 * @param workId
 */
export function formatMusicbrainzWorkUrl (workId: string): string {
  return `https://musicbrainz.org/work/${workId}`
}

/**
 * Format a YouTube URL.
 *
 * `https://youtu.be/CQYypFMTQcE`
 *
 * @param id - The id of a Youtube video (for example CQYypFMTQcE).
 */
export function formatYoutubeUrl (id: string): string {
  return `https://youtu.be/${id}`
}

/**
 * `https://imslp.org/wiki/La_clemenza_di_Tito_(Wagenseil,_Georg_Christoph)`
 *
 * @param id - For example
 *   `La_clemenza_di_Tito_(Wagenseil,_Georg_Christoph)`
 */
export function formatImslpUrl (id: string): string {
  return `https://imslp.org/wiki/${id}`
}

/**
 * `https://commons.wikimedia.org/wiki/File:Cheetah_(Acinonyx_jubatus)_cub.jpg`
 *
 * @param fileName - For example
 *   `Cheetah_(Acinonyx_jubatus)_cub.jpg`
 */
export function formatWikicommonsUrl (fileName: string): string {
  return `https://commons.wikimedia.org/wiki/File:${fileName}`
}

/**
 * Get the plain text version of a HTML string.
 *
 * @param html - A HTML formated string.
 *
 * @returns The plain text version.
 */
export function plainText (html: string): string {
  if (!html) return ''
  // To get spaces between heading and paragraphs
  html = html.replace(/></g, '> <')
  const markup = new DOMParser().parseFromString(html, 'text/html')
  return markup.body.textContent || ''
}

interface ShortenTextOptions {
  stripTags: boolean
  maxLength: number
}

/**
 * Shorten a text string. By default the string is shortend to the maximal
 * length 80.
 *
 * @param text
 * @param options
 */
export function shortenText (text: string, { maxLength, stripTags }: ShortenTextOptions) {
  if (!text) return ''
  if (!maxLength) maxLength = 80
  if (stripTags) text = plainText(text)
  if (text.length < maxLength) return text
  // https://stackoverflow.com/a/5454303
  // trim the string to the maximum length
  text = text.substr(0, maxLength)
  // re-trim if we are in the middle of a word
  text = text.substr(0, Math.min(text.length, text.lastIndexOf(' ')))
  return `${text} …`
}

/**
 * Format a date specification string into a local date string, for
 * example `28. August 1749`
 *
 * @param dateSpec - A valid input for the `Date()` class. If the input
 *   is invalid the raw `dateSpec` is returned.
 */
export function formatToLocalDate (dateSpec: string): string {
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
 * @param dateSpec - For example `1968-01-01`
 *
 * @returns for example `1968`
 */
export function formatToYear (dateSpec: string): string {
  return dateSpec.substr(0, 4)
}

/**
 * Format a timestamp into a string like this example: `Mo 17.2.2020 07:57:53`
 *
 * @param timeStampMsec - The timestamp in milliseconds.
 */
export function formatToLocalDateTime (timeStampMsec: number): string {
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
 * Convert a duration string (8:01 = 8 minutes 1 seconds or 1:33:12 = 1
 * hour 33 minutes 12 seconds) into seconds.
 *
 * @param duration
 */
export function convertDurationToSeconds (duration: string): number {
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
 * @param text
 */
export function toTitleCase (text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}
