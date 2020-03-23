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
    .replace(/[,.] /g, '_')
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
  return transliterate(output)
}

module.exports = {
  asciify
}
