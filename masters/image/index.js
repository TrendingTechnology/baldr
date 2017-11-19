/**
 * @file Master slide “image”
 * @module baldr-master-image
 */

'use strict';

const {MasterOfMasters} = require('baldr-masters');
const {Media} = require('baldr-media');


/**
 * Master class for the master slide “image”
 */
class MasterImage extends MasterOfMasters {

  constructor(propObj) {
    super(propObj);
    this.inputFiles = new Media(this.presentation.pwd);
    this.dataNormalized = this.normalizeData(this.data);
  }

  /**
   *
   */
  normalizeData(data) {
    return this.inputFiles.orderedList(data, 'image');
  }

  /**
   *
   */
  hookSetHTMLSlide() {
    return `<img id="baldr-master-image">`;
  }

  /**
   *
   */
  hookPostFirstSet() {
    this.stepNo = 1;
    this.stepCount = this.dataNormalized.length;
  }

  /**
   */
  hookPostSet() {
    this.elemImage = this.document
      .getElementById('baldr-master-image');
    this.setImage();
  }

  /**
   *
   */
  setImage() {
    this.elemImage
      .setAttribute('src', this.dataNormalized[this.stepNo - 1].path);
  }

  /**
   *
   */
  hookSetStep() {
    this.setImage();
  }

}

exports.MasterImage = MasterImage;

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
