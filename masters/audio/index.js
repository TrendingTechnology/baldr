/**
 * @file Master slide “audio”
 * @module baldr-master-audio
 */

'use strict';

const {Media, audio} = require('baldr-media');
const path = require('path');
const mousetrap = require('mousetrap');

/**
 *this.dataNormalized
 */
exports.normalizeData = function(data) {
  this.inputFiles = new Media(this.presentation.pwd);
  this.dataNormalized = this.normalizeData(this.data);

  var mousetrapbind = function(key, combo) {
    audio.play(audioFiles[key.key]);
  };

  for (var i = 1; i <= this.dataNormalized.length; i++) {
    audioFiles[i] = this.dataNormalized[i - 1];
    mousetrap.bind('ctrl+' + i, mousetrapbind);
  }
  return this.inputFiles.orderedList(data, 'audio');
}

/**
 *
 */
exports.mainHTML = function(data) {
  let out = '';
  for (let audioFile of data) {
    out += `
<li>
  <span class="artist">${audioFile.artist}</span>:
  <span class="title">${audioFile.title}</span>
</li>`;
  }

  return `<ol>${out}</ol>`;
}
