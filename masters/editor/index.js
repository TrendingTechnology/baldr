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
