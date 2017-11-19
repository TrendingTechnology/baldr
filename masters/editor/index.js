/**
 * @file Master slide “editor”
 * @module baldr-master-editor
 */

'use strict';

const {MasterOfMasters, addCSSFile} = require('baldr-masters');
const ContentTools = require('ContentTools');
const path = require('path');

/**
 * Master class for the master slide “editor”
 */
class MasterEditor extends MasterOfMasters {
  constructor(propObj) {
    super(propObj);
    this.theme = 'handwriting';
    addCSSFile(
      this.document,
      path.join(
        path.dirname(require.resolve('ContentTools')),
        'content-tools.min.css'
      )
    );
  }

  /**
   *
   */
  hookSetHTMLSlide() {
    return `
<div data-editable data-name="main-content">

</div>`;
  }

  hookPostSet() {
    ContentTools.StylePalette.add([
        new ContentTools.Style('Author', 'author', ['p'])
    ]);

    let editor = ContentTools.EditorApp.get();
    editor.init('*[data-editable]', 'data-name');
  }

}

exports.MasterEditor = MasterEditor;

/**
 * Export the implemented hooks of this master.
 *
 * @param {object} document The HTML Document Object (DOM) of the
 *   current render process.
 * @param {object} masters All required and loaded masters. Using
 *   `masters.masterName` you have access to all exported methods of
 *   a specific master.
 * @param {object} presentation Object representing the current
 *   presentation session.
 *
 * @return {object} A object, each property represents a hook.
 */
// module.exports = function(document, masters, presentation) {
//   let _export = {};
//   return _export;
// };
