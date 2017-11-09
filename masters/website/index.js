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
    return `<iframe src="${this.data}"></iframe>`;
  }

}

exports.MasterWebsite = MasterWebsite;
