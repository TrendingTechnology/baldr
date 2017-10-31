/**
 * @file Master slide “editor”
 * @module masters/editor
 */

'use strict';

const {MasterOfMasters} = require('../../lib/masters');

/**
 * Master class for the master slide “editor”
 * @class
 */
class MasterEditor extends MasterOfMasters {
  constructor(document, data) {
    super(document, data);
  }

  render() {
    return `editor`;
  }

}

exports.MasterEditor = MasterEditor;
