exports.render = function(data, presentation) {
  return `<video autoplay="true" id="video"></video>`;
};

/**
 * mediaStream.getVideoTracks()[0].getConstraints()
 */
exports.postRender = function(document) {
  navigator.mediaDevices.getUserMedia(
    {
      audio: false,
      video: true
    }
  ).then(function(mediaStream) {
    var video = document.querySelector('video');
    video.src = window.URL.createObjectURL(mediaStream);
    video.onloadedmetadata = function(e) {
      // Do something with the video here.
    };
  }).catch(function(err) {
    console.log(err.name);
  });

  /**
   * List cameras and microphones
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
  navigator.mediaDevices.enumerateDevices()
  .then(function(devices) {
    devices.forEach(function(device) {
      console.log(device.kind + ": " + device.label +  " id = " + device.deviceId);
    });
  })
  .catch(function(err) {
    console.log(err.name + ": " + err.message);
  });

};
