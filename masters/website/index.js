/**
 * @file Master slide “website”
 * @module @bldr/master-website
 */

'use strict'

/***********************************************************************
 * Hooks
 **********************************************************************/

/**
 * @see {@link module:@bldr/electron-app/masters~Master#config}
 */
exports.config = {
  margin: false
}

/**
 * @see {@link module:@bldr/electron-app/masters~Master#quickStartEntries}
 */
exports.quickStartEntries = function () {
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
  ]
}

/**
 * @see {@link module:@bldr/electron-app/masters~Master#mainHTML}
 */
exports.mainHTML = function (slide, config, document) {
  let data = slide.masterData
  return `<webview src="${data}"></webview>`
}
