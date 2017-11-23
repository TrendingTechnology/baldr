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
exports.initSteps = function(document, slide, config) {
  return reIndex(
    new Media(config.sessionDir)
    .orderedList(slide.data, 'image')
  );
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
