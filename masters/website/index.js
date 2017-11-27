/**
 * @file Master slide “website”
 * @module baldr-master-website
 */

'use strict';


/**
 *
 */
exports.quickStartEntries = function() {
  return [
    {
      title: 'Google',
      data: 'https://google.com',
      shortcut: 'ctrl+alt+g',
      fontawesome: 'google'
    },
    {
      title: 'Wikipedia',
      data: 'https://de.wikipedia.org',
      shortcut: 'ctrl+alt+w',
      fontawesome: 'wikipedia-w'
    }
  ];
};

/**
 *
 */
exports.mainHTML = function(slide, config, document) {
  let data = slide.normalizedData;
  return `<webview src="${data}"></webview>`;
};
