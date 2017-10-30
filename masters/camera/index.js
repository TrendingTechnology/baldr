/**
 * @file Master slide “camera”
 * @module masters/camera
 */

'use strict';

const {MasterOfMasters} = require('../../lib/masters');

class Master extends MasterOfMasters {
  constructor(document, data) {
    super(document, data);
  }

}

exports.render = function(data, presentation) {
  return `
  <div class="select">
  <label for="videoSource">Video source: </label><select id="videoSource"></select>
</div>

  <video autoplay="true" id="video"></video>`;

};

/**
 * https://webrtc.github.io/samples/
 * mediaStream.getVideoTracks()[0].getConstraints()
 *

<code><pre>
navigator.mediaDevices.getSupportedConstraints();
{
  "aspectRatio": true,
  "channelCount": true,
  "depthFar": true,
  "depthNear": true,
  "deviceId": true,
  "echoCancellation": true,
  "facingMode": true,
  "focalLengthX": true,
  "focalLengthY": true,
  "frameRate": true,
  "groupId": true,
  "height": true,
  "latency": true,
  "sampleRate": true,
  "sampleSize": true,
  "videoKind": true,
  "volume": true,
  "width": true
}
</pre></code>

 */

/* jshint ignore:start */

exports.postRender = function(document) {
//   navigator.mediaDevices.getUserMedia(
//     {
//       audio: false,
//       video: true,
//     }
//   ).then(function(mediaStream) {
//     var video = document.querySelector('video');
//     video.src = window.URL.createObjectURL(mediaStream);
//     video.onloadedmetadata = function(e) {
//       // Do something with the video here.
//     };
//   }).catch(function(err) {
//     console.log(err.name);
//   });

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
  // navigator.mediaDevices.enumerateDevices()
  // .then(function(devices) {
  //   devices.forEach(function(device) {
  //     //console.log(device.kind + ": " + device.label +  " id = " + device.deviceId);
  //   });
  // })
  // .catch(function(err) {
  //   console.log(err.name + ": " + err.message);
  // });

  var videoElement = document.querySelector('video');
  var videoSelect = document.querySelector('select#videoSource');
  var selectors = [videoSelect];

  function gotDevices(deviceInfos) {
    // Handles being called several times to update labels. Preserve values.
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
        option.text = deviceInfo.label || 'camera ' + (videoSelect.length + 1);
        videoSelect.appendChild(option);
      } else {
        console.log('Some other kind of source/device: ', deviceInfo);
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

  navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);

  // Attach audio output device to video element using device/sink ID.
  function attachSinkId(element, sinkId) {
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

  function gotStream(stream) {
    window.stream = stream; // make stream available to console
    videoElement.srcObject = stream;
    // Refresh button list in case labels have become available
    return navigator.mediaDevices.enumerateDevices();
  }

  function start() {
    if (window.stream) {
      window.stream.getTracks().forEach(function(track) {
        track.stop();
      });
    }
    var videoSource = videoSelect.value;
    var constraints = {
      audio: false,
      video: {deviceId: videoSource ? {exact: videoSource} : undefined}
    };
    navigator.mediaDevices.getUserMedia(constraints).
        then(gotStream).then(gotDevices).catch(handleError);
  }

  videoSelect.onchange = start;

  start();

  function handleError(error) {
    console.log('navigator.getUserMedia error: ', error);
  }

};
/* jshint ignore:end */

exports.Master = Master;
