/**
 * @file Master slide “markdown”
 * @module baldr-master-markdown
 */

'use strict';

const markdown = require('marked');

/**
 *
 */
exports.mainHTML = function(slide, config, document) {
  return markdown(slide.normalizedData);
};
