<template>
  <main class="document-camera">
    <h1>Document Camera</h1>
    <video autoplay="true" id="video"></video>

    <p v-for="device in mediaDevices" :key="device.deviceId">
      {{ device.deviceId }} {{ device.kind }} {{ device.label }}  {{ device.groupId}}

    </p>
  </main>
</template>

<script>

/**
 * @file Master slide “camera”
 *
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
 *
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
 *
 * @module @bldr/master-camera
 */

/**
 * Handles being called several times to update labels. Preserve
 * values.
 */
// function gotDevices (deviceInfos) {
//   while (elemSelect.firstChild) {
//     elemSelect.removeChild(elemSelect.firstChild)
//   }

//   for (var i = 0; i !== deviceInfos.length; ++i) {
//     var deviceInfo = deviceInfos[i]
//     var option = document.createElement('option')
//     option.value = deviceInfo.deviceId
//     if (deviceInfo.kind === 'videoinput') {
//       option.text = deviceInfo.label || 'camera ' + (elemSelect.length + 1)
//       elemSelect.appendChild(option)
//     }
//   }
// }

/**
 * Make stream available to console. Refresh button list in case
 * labels have become available
 */
// function gotStream (stream) {
//   window.stream = stream
//   elemVideo.srcObject = stream
//   return navigator.mediaDevices.enumerateDevices()
// }

/**
 *
 */
// function start () {
//   if (window.stream) {
//     window.stream.getTracks().forEach(function (track) {
//       track.stop()
//     })
//   }
//   var videoSource = elemSelect.value
//   var constraints = {
//     audio: false,
//     video: { deviceId: videoSource ? { exact: videoSource } : undefined }
//   }
//   navigator.mediaDevices.getUserMedia(constraints)
//     .then(gotStream)
//     .then(gotDevices)
// }

import { mapGetters } from 'vuex'

export default {
  name: 'DocumentCamera',
  computed: mapGetters(['mediaDevices']),
  beforeCreate () {
    if (window.stream) {
      window.stream.getTracks().forEach(function (track) {
        track.stop()
      })
    }
    navigator.mediaDevices.getUserMedia({ audio: false, video: true })
      .then(function (stream) {
        console.log(stream)
      })
      .catch(function (error) {
        console.log(error)
      })
    this.$store.dispatch('setMediaDevices')
  }
}
</script>
