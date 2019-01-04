/**
 * @file Render process
 */

var promisifiedOldGUM = function(constraints) {

  var getUserMedia = (navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia);

  if(!getUserMedia) {
    return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
  }

  return new Promise(function(resolve, reject) {
    getUserMedia.call(navigator, constraints, resolve, reject);
  });

};

if(navigator.mediaDevices === undefined) {
  navigator.mediaDevices = {};
}

if(navigator.mediaDevices.getUserMedia === undefined) {
  navigator.mediaDevices.getUserMedia = promisifiedOldGUM;
}

var p = navigator.mediaDevices.getUserMedia({ audio: false, video: true });

p.then(function(mediaStream) {
  var video = document.querySelector('video');
  video.src = window.URL.createObjectURL(mediaStream);
  video.onloadedmetadata = function(e) {
    // Do something with the video here.
  };
});

p.catch(function(err) { console.log(err.name); });

// List cameras and microphones.
navigator.mediaDevices.enumerateDevices()
.then(function(devices) {
  devices.forEach(function(device) {
    console.log(device.kind + ": " + device.label +
                " id = " + device.deviceId);
  });
})
.catch(function(err) {
  console.log(err.name + ": " + err.message);
});
