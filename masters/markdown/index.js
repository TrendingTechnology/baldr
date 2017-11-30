/**
 * @file Master slide “markdown”
 * @module baldr-master-markdown
 */

'use strict';

const markdown = require('marked');

/***********************************************************************
 * Hooks
 **********************************************************************/

/**
 * @see {@link module:baldr-application/masters~Master#mainHTML}
 */
exports.mainHTML = function(slide, config, document) {
  return markdown(slide.normalizedData);
};
