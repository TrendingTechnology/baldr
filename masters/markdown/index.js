/**
 * @file Master slide “markdown”
 * @module @bldr/master-markdown
 */

'use strict'

// Third party packages.
const markdown = require('marked')

/***********************************************************************
 * Hooks
 **********************************************************************/

exports.name = 'markdown'

/**
 * @see {@link module:@bldr/core/masters~Master#mainHTML}
 */
exports.mainHTML = function (slide, config, document) {
  return markdown(slide.masterData)
}
