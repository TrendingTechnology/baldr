/**
 * @file Master slide “markdown”
 * @module baldr-master-markdown
 */

'use strict';

const {MasterOfMasters} = require('baldr-masters');
const markdown = require('marked');

/**
 * Master class for the master slide “markdown”
 */
class MasterMarkdown extends MasterOfMasters {

  constructor(propObj) {
    super(propObj);
  }


  /**
   *
   */
  hookSetHTMLSlide() {
    return markdown(this.data);
  }

}

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
module.exports = function(document, masters, presentation) {
  let _export = {};
  _export.Master = MasterMarkdown;
  return _export;
};
