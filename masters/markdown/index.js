/**
 * @file Master slide “markdown”
 * @module baldr-master-markdown
 */

'use strict';

const markdown = require('marked');

/**
 *
 */
exports.mainHTML = function(data) {
  return markdown(data);
};
