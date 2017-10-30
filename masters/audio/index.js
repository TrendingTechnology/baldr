/**
 * @file Audio master slide
 * @module masters/audio
 */

'use strict';

const {MasterOfMasters} = require('../../lib/masters');

/**
 * Master class
 * @alias module:masters/audio.Master
 */
class Master extends MasterOfMasters {
  constructor(document, data) {
    super(document, data);
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

exports.render = function(data, presentation) {

};

exports.Master = Master;
