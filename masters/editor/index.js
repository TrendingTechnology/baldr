/**
 * @file Master slide “editor”
 * @module baldr-master-editor
 */

'use strict';

const {MasterOfMasters} = require('baldr-masters');

/**
 * Master class for the master slide “editor”
 */
class MasterEditor extends MasterOfMasters {
  constructor(propObj) {
    super(propObj);
    this.theme = 'handwriting';
  }

  /**
   *
   */
  hookSetHTMLSlide() {
    return `editor`;
  }

}

exports.MasterEditor = MasterEditor;
