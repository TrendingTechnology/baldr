/**
 * @file Master slide “audio”
 * @module baldr-master-audio
 */

'use strict';

const {Media, audio} = require('baldr-media');
const path = require('path');
const mousetrap = require('mousetrap');

let audioFiles = {};

/**
 *this.dataNormalized
 */
exports.normalizeData = function(data, config) {
  let inputFiles = new Media(config.sessionDir);
  let files = inputFiles.orderedList(data, 'audio');

  var mousetrapbind = function(key, combo) {
    audio.play(audioFiles[key.key]);
  };

  for (var i = 1; i <= files.length; i++) {
    audioFiles[i] = files[i - 1];
    mousetrap.bind('ctrl+' + i, mousetrapbind);
  }
  return files;
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
