/**
 * @file Master slide “website”
 * @module baldr-master-website
 */

'use strict';

/**
 *
 */
exports.mainHTML = function(slide, config, document) {
  let data = slide.normalizedData;
  return `<webview src="${data}"></webview>`;
}
