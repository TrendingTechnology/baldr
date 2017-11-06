/**
 * @file Master slide “image”
 * @module baldr-master-image
 */

'use strict';

const {MasterOfMasters} = require('baldr-masters');

/**
 * Master class for the master slide “image”
 */
class MasterImage extends MasterOfMasters {

  constructor(propObj) {
    super(propObj);
  }

  /**
   *
   */
  hookSetHTMLSlide() {
    return `<img src="${this.data[0].path}">`;
  }

}

exports.MasterImage = MasterImage;
