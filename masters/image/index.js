/**
 * @file Master slide “image”
 * @module baldr-master-image
 */

'use strict';

const {
  Media,
  reIndex
} = require('baldr-library');

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
exports.initSteps = function(document, slide, config) {
  return reIndex(slide.normalizedData);
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
exports.mainHTML = function(slide, config, document) {
  let path = slide.normalizedData[0].path;
  return `<img id="baldr-master-image" src="${path}">`;
};
