/**
 * @file Master slide “camera”
 * @module masters/camera
 */

 /* jshint -W117 */

'use strict';

const {MasterOfMasters} = require('../../lib/masters');

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
  setHTMLSlide() {
    return '<video autoplay="true" id="video"></video>';
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
