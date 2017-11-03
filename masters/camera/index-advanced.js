/**
 * @file Master slide “camera”
 * @module masters/camera
 */

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
   * Handles being called several times to update labels. Preserve values.
   */
  gotDevices(deviceInfos) {
    var values = this.selectors.map(function(select) {
      return select.value;
    });

    this.selectors.forEach(function(select) {
      while (select.firstChild) {
        select.removeChild(select.firstChild);
      }
    });
    for (var i = 0; i !== deviceInfos.length; ++i) {
      var deviceInfo = deviceInfos[i];
      var option = this.document.createElement('option');
      option.value = deviceInfo.deviceId;
      if (deviceInfo.kind === 'videoinput') {
        option.text = deviceInfo.label || 'camera ' + (this.elemSelect.length + 1);
        this.elemSelect.appendChild(option);
      } else {
        console.log('Some other kind of source/device: ', deviceInfo);
      }
    }

    this.selectors.forEach(function(select, selectorIndex) {
      if (Array.prototype.slice.call(select.childNodes).some(function(n) {
        return n.value === values[selectorIndex];
      })) {
        select.value = values[selectorIndex];
      }
    });
  }

  /**
   * Attach audio output device to video element using device/sink ID.
   */
  attachSinkId(element, sinkId) {
    if (typeof element.sinkId !== 'undefined') {
      element.setSinkId(sinkId)
      .then(function() {
        console.log('Success, audio output device attached: ' + sinkId);
      })
      .catch(function(error) {
        var errorMessage = error;
        if (error.name === 'SecurityError') {
          errorMessage = 'You need to use HTTPS for selecting audio output ' +
              'device: ' + error;
        }
        console.error(errorMessage);
      });
    } else {
      console.warn('Browser does not support output device selection.');
    }
  }

  /**
   *
   */
  gotStream(stream) {
    this.window.stream = stream; // make stream available to console
    this.elemVideo.srcObject = stream;
    // Refresh button list in case labels have become available
    return this.navigator.mediaDevices.enumerateDevices();
  }

  /**
   *
   */
  start() {
    if (this.window.stream) {
      this.window.stream.getTracks().forEach(function(track) {
        track.stop();
      });
    }
    var videoSource = this.elemSelect.value;
    var constraints = {
      audio: false,
      video: {deviceId: videoSource ? {exact: videoSource} : undefined}
    };
    this.navigator.mediaDevices.getUserMedia(constraints)
      .then(this.gotStream)
      .then(this.gotDevices)
      .catch(this.handleError);
  }

  /**
   *
   */
  handleError(error) {
    console.log('navigator.getUserMedia error: ', error);
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
    this.elemVideo = this.document.querySelector('video');
    this.elemSelect = this.document.querySelector('select#videoSource');
    this.selectors = [this.elemSelect];

    this.navigator.mediaDevices
      .enumerateDevices()
      .then(this.gotDevices)
      .catch(this.handleError);
    this.elemSelect.onchange = this.start;
    this.start();
  }

}

exports.MasterCamera = MasterCamera;
