<template>
  <main class="document-camera">
    <h1>Document Camera</h1>

    <a href="#" @click="showDeviceSelect">Video-Ausgabegerät auswählen</a>

    <modal-dialog name="select-video-device">
      <dynamic-select
        placeholder="Wähle ein Video-Device aus"
        :options="mediaDevicesDynamicSelect"
        @input="setDeviceId"
        v-model="deviceId"
      />
    </modal-dialog>

    <video ref="videoTag" autoplay="true" id="video"></video>
  </main>
</template>

<script>

/**
 * @file Master slide “camera”
 *
 * To create virtual video devices on linux run this commands:
 *
 * <code><pre>
 * sudo apt install v4l2loopback-dkms
 * sudo modprobe v4l2loopback devices=4
 * sudo apt install apt install v4l2loopback-utils
 * # Capture desktop
 * ffmpeg -f x11grab -r 15 -s 1280x720 -i :0.0+0,0 -vcodec rawvideo -pix_fmt yuv420p -threads 0 -f v4l2 /dev/video0
 *
 * # Show image
 * ffmpeg -loop 1 -re -i image.jpg -f v4l2 -vcodec rawvideo -pix_fmt yuv420p /dev/video0
 *
 * # Show video
 * ffmpeg -re -i video.mp4 -f v4l2 /dev/video2
 * </pre></code>
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

import { mapGetters } from 'vuex'

export default {
  name: 'DocumentCamera',
  data () {
    return {
      deviceId: ''
    }
  },
  computed: mapGetters(['mediaDevices', 'mediaDevicesDynamicSelect']),
  methods: {
    setDeviceId () {
      this.$modal.hide('select-video-device')
      const constraints = {
        audio: false,
        video: { deviceId: { exact: this.deviceId.id } }
      }
      console.log(constraints)
      this.setVideoStream(constraints)
    },
    showDeviceSelect () {
      this.$modal.toggle('select-video-device')
      this.$dynamicSelect.focus()
    },
    setVideoStream (constraints) {
      if (!constraints) {
        constraints = { audio: false, video: true }
      }
      navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
          console.log(stream)
          this.$refs.videoTag.srcObject = stream
          this.$store.dispatch('setMediaDevices')
        })
        .catch(function (error) {
          console.error(error)
        })
    }
  },
  created () {
    if (window.stream) {
      window.stream.getTracks().forEach(function (track) {
        track.stop()
      })
    }
    this.setVideoStream()
  }
}
</script>
