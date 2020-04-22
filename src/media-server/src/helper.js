/**
 * @module @bldr/media-server/helper
 */

const { transliterate } = require('transliteration')

/**
 * Convert some unicode strings into the ASCII format.
 *
 * @param {String} input
 *
 * @returns {String}
 */
function asciify (input) {
  const output = String(input)
    .replace(/[\(\)';]/g, '') // eslint-disable-line
    .replace(/[,\.] /g, '_') // eslint-disable-line
    .replace(/ +- +/g, '_')
    .replace(/\s+/g, '-')
    .replace(/&/g, '-')
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
 * This function can be used to generate ids from different file names.
 *
 * Some addictional replace which can not be done in asciify (asciffy is
 * sometimes applied to paths.)
 */
function idify (input) {
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
 *
 * @param {String} input
 *
 * @returns {String}
 */
function deasciify (input) {
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

module.exports = {
  asciify,
  idify,
  deasciify
}
