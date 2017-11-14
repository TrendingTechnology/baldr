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
      console.log(audioFiles[key.key]);
      audio.play(audioFiles[key.key]);
    };

    console.log(this.dataNormalized)
    for (var i = 1; i <= this.dataNormalized.length; i++) {
      console.log(this.dataNormalized)
      audioFiles[i] = this.dataNormalized[i - 1].path;
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

exports.MasterAudio = MasterAudio;
