/**
 * @file Master slide “website”
 * @module baldr-master-website
 */

'use strict';

const {MasterOfMasters} = require('baldr-masters');

/**
 * Master class for the master slide “website”
 *
 * @implements {MasterOfMasters}
 */
class MasterWebsite extends MasterOfMasters {

  constructor(propObj) {
    super(propObj);
  }

  /**
   *
   */
  hookSetHTMLSlide() {
    return `<webview src="${this.data}"></webview>`;
  }

}

exports.MasterWebsite = MasterWebsite;

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
