/**
 * Format functions to manipulate strings.
 *
 * @module @bldr/core-browser/string-format
 */

import { transliterate } from 'transliteration'

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
 * Generate the n-th file name or the URL from a file name or a URL of the first
 * element of a multipart asset. The parameter `firstFileName` must have a
 * extension (for example `.jpg`). The parameter `no` must be less then 1000.
 * Only tree digit or smaller integers are allowed.
 *
 * 1. `multipart-asset.jpg`
 * 2. `multipart-asset_no002.jpg`
 * 3. `multipart-asset_no003.jpg`
 * 4. ...
 *
 * @param firstFileName - A file name, a path or a URL.
 * @param no - The number in the multipart asset list. The first element has the
 *   number 1.
 */
export function formatMultiPartAssetFileName (
  firstFileName: string,
  no: string | number
): string {
  if (!Number.isInteger(no)) {
    no = 1
  }

  if (no > 999) {
    throw new Error(
      `${firstFileName}: The multipart asset number must not be greater than 999.`
    )
  }

  let suffix
  if (no === 1) {
    return firstFileName
  } else if (no < 10) {
    suffix = `_no00${no}`
  } else if (no < 100) {
    suffix = `_no0${no}`
  } else {
    suffix = `_no${no}`
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
    'Januar',
    'Februar',
    'März',
    'April',
    'Mai',
    'Juni',
    'Juli',
    'August',
    'September',
    'Oktober',
    'November',
    'Dezember'
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
  } else {
    dayString = ''
  }
  const dateString = date.toLocaleDateString()
  const timeString = date.toLocaleTimeString()
  return `${dayString} ${dateString} ${timeString}`
}

/**
 * Convert a duration string (8:01 = 8 minutes 1 seconds or 1:33:12 = 1
 * hour 33 minutes 12 seconds) into seconds.
 */
export function convertDurationToSeconds (duration: string | number): number {
  if (typeof duration === 'number') {
    return duration
  }
  if (typeof duration === 'string' && duration.match(/:/) != null) {
    const segments = duration.split(':')
    if (segments.length === 3) {
      return (
        parseInt(segments[0]) * 3600 +
        parseInt(segments[1]) * 60 +
        parseInt(segments[2])
      )
    } else if (segments.length === 2) {
      return parseInt(segments[0]) * 60 + parseInt(segments[1])
    }
  }
  return Number.parseFloat(duration)
}

/**
 * Convert a single word into title case, for example `word` gets `Word`.
 */
export function toTitleCase (text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/**
 * Strip HTML tags from a string.
 *
 * @param text - A text containing HTML tags.
 */
export function stripTags (text: string): string {
  return text.replace(/<[^>]+>/g, '')
}

/**
 * Convert some unicode strings into the ASCII format.
 */
export function asciify (input: string): string {
  const output = String(input)
    .replace(/[\(\)';]/g, '') // eslint-disable-line
    .replace(/[,\.] /g, '_') // eslint-disable-line
    .replace(/ +- +/g, '_')
    .replace(/\s+/g, '-')
    .replace(/[&+]/g, '-')
    .replace(/-+/g, '-')
    .replace(/-*_-*/g, '_')
    .replace(/Ä/g, 'Ae')
    .replace(/ä/g, 'ae')
    .replace(/Ö/g, 'Oe')
    .replace(/ö/g, 'oe')
    .replace(/Ü/g, 'Ue')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/!/g, '')
  return transliterate(output)
}

/**
 * This function can be used to generate IDs from different file names.
 *
 * It performes some addictional replacements which can not be done in `asciify`
 * (`asciffy` is sometimes applied to paths.)
 */
export function referencify (input: string): string {
  let output = asciify(input)

  // asciify is used by rename. We can not remove dots because of the exentions
  output = output.replace(/\./g, '')

  //  “'See God's ark' ” -> See-Gods-ark-
  output = output.replace(/^[^A-Za-z0-9]*/, '')
  output = output.replace(/[^A-Za-z0-9]*$/, '')
  // Finally remove all non ID characters.
  output = output.replace(/[^A-Za-z0-9-_]+/g, '')
  return output
}

/**
 * This function can be used to generate a title from an ID string.
 */
export function deasciify (input: string): string {
  return String(input)
    .replace(/_/g, ', ')
    .replace(/-/g, ' ')
    .replace(/Ae/g, 'Ä')
    .replace(/ae/g, 'ä')
    .replace(/Oe/g, 'Ö')
    .replace(/oe/g, 'ö')
    .replace(/Ue/g, 'Ü')
    .replace(/ue/g, 'ü')
}
