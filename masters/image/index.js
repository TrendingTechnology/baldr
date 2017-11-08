/**
 * @file Master slide “image”
 * @module baldr-master-image
 */

'use strict';

const {MasterOfMasters} = require('baldr-masters');
const {InputFiles} = require('baldr-input-files');


/**
 * Master class for the master slide “image”
 */
class MasterImage extends MasterOfMasters {

  constructor(propObj) {
    super(propObj);
    if (this.presentation) {
      this.inputFiles = new InputFiles(this.presentation.pwd);
      this.dataNormalized = this.normalizeData(this.data);
    }
  }

  /**
   *
   */
  normalizeSinglePath(filePath) {
    return this.inputFiles.filter(
      filePath,
      ['jpg', 'jpeg', 'png']
    );
  }

  /**
   *
   */
  normalizeData(data) {
     if (typeof data === 'object' && Array.isArray(data)) {
      let out = [];
      for (let filePath of data) {
        var images = this.normalizeSinglePath(filePath);
        for (let image of images) {
          out.push(image);
        }
      }
      return out;
    } else if (typeof data === 'string') {
      return this.normalizeSinglePath(data);
    }
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
      .setAttribute('src', this.dataNormalized[this.stepNo - 1]);
  }

  /**
   *
   */
  hookSetStep() {
    this.setImage();
  }

}

exports.MasterImage = MasterImage;
