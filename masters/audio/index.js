/**
 * @file Master slide “audio”
 * @module baldr-master-audio
 */

'use strict';

const {MasterOfMasters} = require('baldr-masters');
const {Media} = require('baldr-media');
const path = require('path');
const {Howl} = require('howler');
const mousetrap = require('mousetrap');


let howls = {};

/**
 * Master class for the master slide “audio”
 */
class MasterAudio extends MasterOfMasters {
  constructor(propObj) {
    super(propObj);
    this.inputFiles = new Media(this.presentation.pwd);
    this.dataNormalized = this.normalizeData(this.data);
    let audioFiles = this.dataNormalized;

    var mousetrapbind = function(key, combo) {
      howls[key.key].play();
    };

    for (var i = 1; i <= audioFiles.length; i++) {
      howls[i] = new Howl({src: [audioFiles[i - 1].path]});
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
