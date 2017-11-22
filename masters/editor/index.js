/**
 * @file Master slide “editor”
 * @module baldr-master-editor
 */

'use strict';

const {MasterOfMasters, addCSSFile} = require('baldr-masters');
const ContentTools = require('ContentTools');
const path = require('path');

exports.config = {
  theme: 'handwriting'
};

exports.mainHTML = function(data, config, document) {
  addCSSFile(
    document,
    path.join(
      path.dirname(require.resolve('ContentTools')),
      'content-tools.min.css'
    )
  );
  return `<div data-editable data-name="main-content"></div>`;
}

exports.hookPostSet = function() {
  ContentTools.StylePalette.add([
    new ContentTools.Style('Author', 'author', ['p'])
  ]);

  let editor = ContentTools.EditorApp.get();
  editor.init('*[data-editable]', 'data-name');
}
