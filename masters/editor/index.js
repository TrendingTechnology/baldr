/**
 * @file Master slide “editor”
 * @module @bldr/master-editor
 */

'use strict'

const ContentTools = require('ContentTools')
const path = require('path')

const { addCSSFile } = require('@bldr/library')

/***********************************************************************
 * Hooks
 **********************************************************************/

/**
 * @see {@link module:@bldr/electron-app/masters~Master#config}
 */
exports.config = {
  theme: 'handwriting'
}

/**
 * @see {@link module:@bldr/electron-app/masters~Master#quickStartEntries}
 */
exports.quickStartEntries = function () {
  return [
    {
      title: 'Editor',
      shortcut: 'ctrl+alt+e',
      fontawesome: 'list'
    }
  ]
}

/**
 * @see {@link module:@bldr/electron-app/masters~Master#mainHTML}
 */
exports.mainHTML = function (slide, config, document) {
  addCSSFile(
    document,
    path.join(
      path.dirname(require.resolve('ContentTools')),
      'content-tools.min.css'
    )
  )
  return `<div data-editable data-name="main-content"></div>`
}

/**
 * @see {@link module:@bldr/electron-app/masters~Master#postSet}
 */
exports.postSet = function (slide, config, document) {
  ContentTools.StylePalette.add([
    new ContentTools.Style('Author', 'author', ['p'])
  ])

  let editor = ContentTools.EditorApp.get()
  editor.init('*[data-editable]', 'data-name')
}

/**
 * @see {@link module:@bldr/electron-app/masters~Master#cleanUp}
 */
exports.cleanUp = function (document, oldSlide, newSlide) {
  let elements = document.querySelectorAll('.ct-app')
  for (let element of elements) {
    element.remove()
  }
}
