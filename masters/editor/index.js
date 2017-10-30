/**
 * @file Master slide “editor”
 * @module masters/editor
 */

'use strict';

const {MasterOfMasters} = require('../../lib/masters');

/**
 * Master class for the master slide “editor”
 * @class
 * @alias MasterEditor
 */
class Master extends MasterOfMasters {
  constructor(document, data) {
    super(document, data);
  }

}

exports.render = function() {
  return `editor`;
};

exports.Master = Master;
