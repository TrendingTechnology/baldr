/**
 * @file Master slide “camera”
 * @module baldr-master-camera
 */

/* jshint -W117 */

'use strict';

const {MasterOfMasters} = require('baldr-masters');

/**
 * Master class for the master slide “camera”
 *
 * https://webrtc.github.io/samples/
 * mediaStream.getVideoTracks()[0].getConstraints()
 *
 * <code><pre>
 * navigator.mediaDevices.getSupportedConstraints();
 * {
 *   "aspectRatio": true,
 *   "channelCount": true,
 *   "depthFar": true,
 *   "depthNear": true,
 *   "deviceId": true,
 *   "echoCancellation": true,
 *   "facingMode": true,
 *   "focalLengthX": true,
 *   "focalLengthY": true,
 *   "frameRate": true,
 *   "groupId": true,
 *   "height": true,
 *   "latency": true,
 *   "sampleRate": true,
 *   "sampleSize": true,
 *   "videoKind": true,
 *   "volume": true,
 *   "width": true
 * }
 * </pre></code>
 */
class MasterCamera extends MasterOfMasters {
  constructor(propObj) {
    super(propObj);
  }

  /**
   *
   */
  hookSetHTMLModal() {
    return `
    <div class="select">
      <label for="videoSource">Video source:</label>
      <select id="videoSource"></select>
    </div>`;
  }

  /**
   *
   */
  hookSetHTMLSlide() {
    return '<video autoplay="true" id="video"></video>';
  }

  /**
   * videoinput: Integrated Camera: Integrated C (04f2:b221) id = 1981dfec8d8861d2407ba74d86a2d777ec4b9d51d11644bad7f20645fd775eb2
   * supportedConstraints
   *
   * <code><pre>
   * {
   *   "deviceId": "21c19a409344f4bee3a71d7b1b14d1bb452dcd86cba8c9c5136a992c33241c08",
   *   "kind": "videoinput",
   *   "label": "USB Webcam (0bda:5727)",
   *   "groupId": ""
   * }
   * </pre></code>
   */
  hookPostSet() {

    /**
     * Handles being called several times to update labels. Preserve
     * values.
     */
    function gotDevices(deviceInfos) {
      while (elemSelect.firstChild) {
        elemSelect.removeChild(elemSelect.firstChild);
      }

      for (var i = 0; i !== deviceInfos.length; ++i) {
        var deviceInfo = deviceInfos[i];
        var option = document.createElement('option');
        option.value = deviceInfo.deviceId;
        if (deviceInfo.kind === 'videoinput') {
          option.text = deviceInfo.label || 'camera ' + (elemSelect.length + 1);
          elemSelect.appendChild(option);
        }
      }
    }

    /**
     * Make stream available to console. Refresh button list in case
     * labels have become available
     */
    function gotStream(stream) {
      window.stream = stream;
      elemVideo.srcObject = stream;
      return navigator.mediaDevices.enumerateDevices();
    }

    /**
     *
     */
    function start() {
      if (window.stream) {
        window.stream.getTracks().forEach(function(track) {
          track.stop();
        });
      }
      var videoSource = elemSelect.value;
      var constraints = {
        audio: false,
        video: {deviceId: videoSource ? {exact: videoSource} : undefined}
      };
      navigator.mediaDevices.getUserMedia(constraints)
        .then(gotStream)
        .then(gotDevices);
    }

    var elemVideo = document.querySelector('video');
    var elemSelect = document.querySelector('select#videoSource');

    navigator.mediaDevices
      .enumerateDevices()
      .then(gotDevices);
    elemSelect.onchange = start;
    start();
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
  _export.Master = MasterCamera;
  return _export;
};
