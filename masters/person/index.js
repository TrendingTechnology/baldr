/**
 * @file Master slide “person”
 * @module masters/person
 */

'use strict';

const {MasterOfMasters} = require('../../lib/masters');

class Master extends MasterOfMasters {
  constructor(document, data) {
    super(document, data);
  }

}

exports.render = function(data, presentation) {
  return `
<section id="master-person">

  <img src="${presentation.pwd}/${data.image}">

  <div id="info-box">
    <p>${data.name}</p>
  </div>

</section>
`;

};

exports.Master = Master;
