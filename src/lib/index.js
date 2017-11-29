/**
 * @module baldr-library
 */

'use strict';

const path = require('path');

/**
 *
 */
let requireLib = function(fileName) {
  return require(path.join(__dirname, fileName + '.js'));
};

const {getConfig} = requireLib('config');
const {
  addCSSFile,
  reIndex,
  checkProperty
} = requireLib('helper');
const {Media} = requireLib('media');

module.exports = {
  addCSSFile: addCSSFile,
  getConfig: getConfig,
  Media: Media,
  reIndex: reIndex,
  checkProperty: checkProperty
};
