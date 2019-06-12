/**
 * @file Master slide “image”
 * @module @bldr/master-image
 */

'use strict'

// Project packages.
const {
  Media,
  reIndex
} = require('@bldr/foundation-master')

/***********************************************************************
 * Hooks
 **********************************************************************/

exports.name = 'image'

/**
 * @see {@link module:@bldr/core/masters~Master#quickStartEntries}
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
 * @see {@link module:@bldr/core/masters~Master#normalizeData}
 */
exports.normalizeData = function (rawSlideData, config) {
  return new Media(config.sessionDir)
    .orderedList(rawSlideData, 'image')
}

/**
 * @see {@link module:@bldr/core/masters~Master#initSteps}
 */
exports.initSteps = function (document, slide, config) {
  return reIndex(slide.masterData)
}

/**
 * @see {@link module:@bldr/core/masters~Master#setStepByNo}
 */
exports.setStepByNo = function (no, count, stepData, document) {
  document
    .getElementById('@bldr/master-image')
    .setAttribute('src', stepData[no].path)
}

/**
 * @see {@link module:@bldr/core/masters~Master#config}
 */
exports.config = {
  stepSupport: true,
  margin: false
}

/**
 * @see {@link module:@bldr/core/masters~Master#mainHTML}
 */
exports.mainHTML = function (slide, config, document) {
  let path = slide.masterData[0].path
  return `<img id="@bldr/master-image" src="${path}">`
}
