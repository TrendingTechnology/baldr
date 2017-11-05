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

exports.MasterPerson = MasterPerson;
