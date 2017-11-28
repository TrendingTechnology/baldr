/**
 * @file Master slide “editor”
 * @module baldr-master-editor
 */

'use strict';

const ContentTools = require('ContentTools');
const path = require('path');

const {addCSSFile} = require('baldr-library');

/***********************************************************************
 * Hooks
 **********************************************************************/

/**
 * @see {@link module:baldr-master_INTERFACE.config}
 */
exports.config = {
  theme: 'handwriting'
};

/**
 * @see {@link module:baldr-master_INTERFACE.quickStartEntries}
 */
exports.quickStartEntries = function() {
  return [
    {
      title: 'Editor',
      shortcut: 'ctrl+alt+e',
      fontawesome: 'list'
    }
  ];
};

/**
 * @see {@link module:baldr-master_INTERFACE.mainHTML}
 */
exports.mainHTML = function(slide, config, document) {
  addCSSFile(
    document,
    path.join(
      path.dirname(require.resolve('ContentTools')),
      'content-tools.min.css'
    )
  );
  return `<div data-editable data-name="main-content"></div>`;
};

/**
 * @see {@link module:baldr-master_INTERFACE.postSet}
 */
exports.postSet = function(slide, config, document) {
  ContentTools.StylePalette.add([
    new ContentTools.Style('Author', 'author', ['p'])
  ]);

  let editor = ContentTools.EditorApp.get();
  editor.init('*[data-editable]', 'data-name');
};

/**
 * @see {@link module:baldr-master_INTERFACE.cleanUp}
 */
exports.cleanUp = function(document, oldSlide, newSlide) {
  document.querySelector('.ct-app').remove();
};
