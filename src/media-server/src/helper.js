/**
 * @module @bldr/media-server/helper
 */

const { transliterate } = require('transliteration')

/**
 * This function can be used to generate ids from different file names.
 *
 * @param {String} input
 *
 * @returns {String}
 */
function asciify (input) {
  const output = input
    .replace(/[\(\)';]/g, '') // eslint-disable-line
    .replace(/[,\.] /g, '_')
    .replace(/ +- +/g, '_')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/-*_-*/g, '_')
    .replace(/Ä/g, 'Ae')
    .replace(/ä/g, 'ae')
    .replace(/Ö/g, 'Oe')
    .replace(/ö/g, 'oe')
    .replace(/Ü/g, 'Ue')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/\./g, '')
  return transliterate(output)
}

/**
 * This function can be used to generate a title from an ID string.
 *
 * @param {String} input
 *
 * @returns {String}
 */
function deasciify (input) {
  return input
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
  deasciify
}
