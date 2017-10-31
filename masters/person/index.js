/**
 * @file Master slide “person”
 * @module masters/person
 */

'use strict';

const {MasterOfMasters} = require('../../lib/masters');

/**
 * Master class for the master slide “person”
 * @class
 * @alias MasterPerson
 */
class Master extends MasterOfMasters {
  constructor(propObj) {
    super(propObj);
  }

  render() {
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

exports.Master = Master;
