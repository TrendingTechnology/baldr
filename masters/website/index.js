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
      shortcut: '',
      fontawesome: 'google'
    },
    {
      title: 'Wikipedia',
      data: 'https://de.wikipedia.org',
      shortcut: '',
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
