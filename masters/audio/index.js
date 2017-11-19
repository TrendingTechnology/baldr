/**
 * @file Master slide “audio”
 * @module baldr-master-audio
 */

'use strict';

const {MasterOfMasters} = require('baldr-masters');
const {Media, audio} = require('baldr-media');
const path = require('path');
const mousetrap = require('mousetrap');

let audioFiles = [];

/**
 * Master class for the master slide “audio”
 */
class MasterAudio extends MasterOfMasters {
  constructor(propObj) {
    super(propObj);
    this.inputFiles = new Media(this.presentation.pwd);
    this.dataNormalized = this.normalizeData(this.data);

    var mousetrapbind = function(key, combo) {
      audio.play(audioFiles[key.key]);
    };

    for (var i = 1; i <= this.dataNormalized.length; i++) {
      audioFiles[i] = this.dataNormalized[i - 1];
      mousetrap.bind('ctrl+' + i, mousetrapbind);
    }

  }

  /**
   *this.dataNormalized
   */
  normalizeData(data) {
    return this.inputFiles.orderedList(data, 'audio');
  }

  /**
   *
   */
  hookSetHTMLSlide() {
    let out = '';
    for (let audioFile of this.dataNormalized) {
      out += `
  <li>
    <span class="artist">${audioFile.artist}</span>:
    <span class="title">${audioFile.title}</span>
  </li>`;
    }

    return `<ol>${out}</ol>`;
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
  _export.Master = MasterAudio;
  return _export;
};
