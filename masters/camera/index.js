/**
 * @file Master slide “camera”
 * @module masters/camera
 */

 /* jshint -W117 */

'use strict';

const {MasterOfMasters} = require('baldr-masters');

/**
 * Master class for the master slide “camera”
 *
 */
class MasterCamera extends MasterOfMasters {
  constructor(propObj) {
    super(propObj);
  }

  /**
   *
   */
  hookSetHTMLSlide() {
    return '<video autoplay="true" id="video">camera</video>';
  }


  /**
   *
   */
  hookPostSet() {
    var media = navigator.mediaDevices.getUserMedia({ audio: false, video: true });

    media.then(function(mediaStream) {
      var video = document.querySelector('video');
      video.src = window.URL.createObjectURL(mediaStream);
    });

  }

}

exports.MasterCamera = MasterCamera;
