/**
 * @file Master slide “image”
 * @module baldr-master-image
 */

'use strict';

const {Media} = require('baldr-media');

/**
 *
 */
exports.normalizeData = function(data, document, config) {
  let inputFiles = new Media(config.sessionDir);
  return {
    elemImage: document.getElementById('baldr-master-image'),
    inputFiles: inputFiles.orderedList(data, 'image')
  }
};

/**
 *
 */
exports.initSteps = function(data, document) {
  let inputFiles = new Media(config.sessionDir);
  return {
    elemImage: document.getElementById('baldr-master-image'),
    inputFiles: inputFiles.orderedList(data, 'image')
  }
};

/**
 *
 */
exports.setStepByNo = function(no, count, data) {
  this.elemImage
    .setAttribute('src', this.dataNormalized[this.stepNo - 1].path);
}

/**
 *
 */
exports.config = {
  stepSupport: true
};

/**
 *
 */
exports.mainHTML = function() {
  return `<img id="baldr-master-image">`;
};
