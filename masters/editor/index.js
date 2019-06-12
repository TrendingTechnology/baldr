/**
 * @file Master slide “editor”
 * @module @bldr/master-editor
 */

'use strict'

// Third party packages.
const ContentTools = require('ContentTools')
const path = require('path')

// Project packages.
const { addCSSFile } = require('@bldr/foundation-master')

/***********************************************************************
 * Hooks
 **********************************************************************/

exports.name = 'editor'

/**
 * @see {@link module:@bldr/core/masters~Master#config}
 */
exports.config = {
  theme: 'handwriting'
}

/**
 * @see {@link module:@bldr/core/masters~Master#quickStartEntries}
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
 * @see {@link module:@bldr/core/masters~Master#mainHTML}
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
 * @see {@link module:@bldr/core/masters~Master#postSet}
 */
exports.postSet = function (slide, config, document) {
  ContentTools.StylePalette.add([
    new ContentTools.Style('Author', 'author', ['p'])
  ])

  let editor = ContentTools.EditorApp.get()
  editor.init('*[data-editable]', 'data-name')
}

/**
 * @see {@link module:@bldr/core/masters~Master#cleanUp}
 */
exports.cleanUp = function (document, oldSlide, newSlide) {
  let elements = document.querySelectorAll('.ct-app')
  for (let element of elements) {
    element.remove()
  }
}
