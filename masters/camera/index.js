exports.render = function(data, presentation) {
  return `<video autoplay="true" id="video"></video>`;
};

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


};
