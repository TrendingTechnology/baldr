/**
 * @file Master slide “image”
 * @module baldr-master-image
 */

'use strict'

const {
  Media,
  reIndex
} = require('baldr-library')

/***********************************************************************
 * Hooks
 **********************************************************************/

/**
 * @see {@link module:baldr-application/masters~Master#quickStartEntries}
 */
exports.quickStartEntries = function () {
  return [
    {
      title: 'Image',
      master: 'image',
      shortcut: 'ctrl-alt-i',
      fontawesome: 'file-image-o'
    }
  ]
}

/**
 * @see {@link module:baldr-application/masters~Master#normalizeData}
 */
exports.normalizeData = function (rawSlideData, config) {
  return new Media(config.sessionDir)
    .orderedList(rawSlideData, 'image')
}

/**
 * @see {@link module:baldr-application/masters~Master#initSteps}
 */
exports.initSteps = function (document, slide, config) {
  return reIndex(slide.masterData)
}

/**
 * @see {@link module:baldr-application/masters~Master#setStepByNo}
 */
exports.setStepByNo = function (no, count, stepData, document) {
  document
    .getElementById('baldr-master-image')
    .setAttribute('src', stepData[no].path)
}

/**
 * @see {@link module:baldr-application/masters~Master#config}
 */
exports.config = {
  stepSupport: true,
  margin: false
}

/**
 * @see {@link module:baldr-application/masters~Master#mainHTML}
 */
exports.mainHTML = function (slide, config, document) {
  let path = slide.masterData[0].path
  return `<img id="baldr-master-image" src="${path}">`
}
