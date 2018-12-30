/**
 * @file Master slide “markdown”
 * @module @bldr/master-markdown
 */

'use strict'

const markdown = require('marked')

/***********************************************************************
 * Hooks
 **********************************************************************/

/**
 * @see {@link module:@bldr/electron-app/masters~Master#mainHTML}
 */
exports.mainHTML = function (slide, config, document) {
  return markdown(slide.masterData)
}
