/**
 * @file Master slide “website”
 * @module baldr-master-website
 */

'use strict';

/**
 *
 */
exports.mainHTML = function(data) {
  return `<webview src="${data}"></webview>`;
}
