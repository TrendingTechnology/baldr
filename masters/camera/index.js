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
      <label for="videoSource">Video source: </label><select id="videoSource"></select>
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
      var values = selectors.map(function(select) {
        return select.value;
      });

      selectors.forEach(function(select) {
        while (select.firstChild) {
          select.removeChild(select.firstChild);
        }
      });
      for (var i = 0; i !== deviceInfos.length; ++i) {
        var deviceInfo = deviceInfos[i];
        var option = document.createElement('option');
        option.value = deviceInfo.deviceId;
        if (deviceInfo.kind === 'videoinput') {
          option.text = deviceInfo.label || 'camera ' + (elemSelect.length + 1);
          elemSelect.appendChild(option);
        }
      }

      selectors.forEach(function(select, selectorIndex) {
        if (Array.prototype.slice.call(select.childNodes).some(function(n) {
          return n.value === values[selectorIndex];
        })) {
          select.value = values[selectorIndex];
        }
      });
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
    function handleError(error) {
      console.log('navigator.getUserMedia error: ', error);
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
        .then(gotDevices)
        .catch(handleError);
    }

    var elemVideo = document.querySelector('video');
    var elemSelect = document.querySelector('select#videoSource');
    var selectors = [elemSelect];

    navigator.mediaDevices
      .enumerateDevices()
      .then(gotDevices)
      .catch(handleError);
    elemSelect.onchange = start;
    start();
  }

}

exports.MasterCamera = MasterCamera;
