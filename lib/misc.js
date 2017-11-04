/**
 * @file Load the slides object form the YAML file format and process it.
 * @module lib/misc
 */

const fs = require('fs');
const path = require('path');

/**
 * TODO: Move to another file
 * Search for a *.baldr file in the argv array. Return the last
 * matched element.
 *
 * @param {array} argv Arguments in process.argv
 * @return {string} The path of a BALDUR file.
 */
exports.searchForBaldrFile = function(argv) {
  let clone = argv.slice(0);
  clone.reverse();

  for (let arg of clone) {
    if (arg.search(/\.baldr$/ig) > -1) {
      return arg;
    }
  }
  throw new Error('No presentation file with the extension *.baldr found!');
};
