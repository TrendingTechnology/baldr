/**
 * @file Master slide “editor”
 * @module masters/editor
 */

'use strict';

const {MasterOfMasters} = require('baldr-masters');

/**
 * Master class for the master slide “editor”
 */
class MasterEditor extends MasterOfMasters {
  constructor(propObj) {
    super(propObj);
  }

  /**
   *
   */
  hookSetHTMLSlide() {
    return `editor`;
  }

}

exports.MasterEditor = MasterEditor;
