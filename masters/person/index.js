/**
 * @file Master slide “person”
 * @module baldr-master-person
 */

'use strict';

const {MasterOfMasters} = require('baldr-masters');

/**
 * Master class for the master slide “person”
 * @class
 */
class MasterPerson extends MasterOfMasters {
  constructor(propObj) {
    super(propObj);
  }

  /**
   *
   */
  hookSetHTMLSlide() {
    return `
  <section id="master-person">

    <img src="${this.presentation.pwd}/${this.data.image}">

    <div id="info-box">
      <p>${this.data.name}</p>
    </div>

  </section>
  `;
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
  _export.Master = MasterPerson;
  return _export;
};
