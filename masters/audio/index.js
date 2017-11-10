/**
 * @file Master slide “audio”
 * @module baldr-master-audio
 */

'use strict';

const {MasterOfMasters} = require('baldr-masters');
const {InputFiles} = require('baldr-input-files');
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
    this.inputFiles = new InputFiles(this.presentation.pwd);
    this.dataNormalized = this.normalizeData(this.data);
    let audioFiles = this.dataNormalized;

    var mousetrapbind = function(key, combo) {
      howls[key.key].play();
    };

    for (var i = 1; i <= audioFiles.length; i++) {
      howls[i] = new Howl({src: [audioFiles[i - 1]]});
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
    let fileName;
    for (let audioFile of this.dataNormalized) {
      fileName = path.basename(audioFile);
      out += `<li>${fileName}</li>`;
    }

    return `<ol>${out}</ol>`;
  }

}

// var sound = new Howl({
//   src: ['sample.mp3'],
// 	html5: true,
// 	sprite: {
// 		blast: [0, 3000],
// 		laser: [4000, 500],
// 		winner: [6000, 5000]
// 	}
// });
//
// Mousetrap.bind('p', function() {sound.play();});
// Mousetrap.bind('l', function() {sound.play('laser');});
// Mousetrap.bind('b', function() {sound.play('blast');});
// Mousetrap.bind('w', function() {sound.play('winner');});
// Mousetrap.bind('f', function() {sound.fade(1, 0, 5000);});

exports.MasterAudio = MasterAudio;
