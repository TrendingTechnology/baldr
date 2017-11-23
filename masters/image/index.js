/**
 * @file Master slide “image”
 * @module baldr-master-image
 */

'use strict';

const {Media} = require('baldr-media');
const {reIndex} = require('baldr-masters');

/**
 *
 */
exports.normalizeData = function(rawSlideData, config) {
  return new Media(config.sessionDir)
    .orderedList(rawSlideData, 'image');
};

/**
 *
 */
exports.initSteps = function(document, slide, config, normalizedSlideData) {
  return reIndex(normalizedSlideData);
};

/**
 *
 */
exports.setStepByNo = function(no, count, stepData, document) {
  document
    .getElementById('baldr-master-image')
    .setAttribute('src', stepData[no].path);
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
