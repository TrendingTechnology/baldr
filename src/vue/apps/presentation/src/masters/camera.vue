<template>
  <div class="camera-master">
    <!-- <a href="#" @click="showDeviceSelect">Video-Ausgabegerät auswählen</a>

    <a href="#" @click="stopVideoStream">Video-Ausgabegerät deaktivieren</a>

    <a href="#" @click="setFullScreen">Full screen</a> -->

    <modal-dialog name="select-video-device">
      <dynamic-select
        placeholder="Wähle ein Video-Device aus"
        :options="mediaDevicesDynamicSelect"
        @input="setDeviceId"
        v-model="deviceId"
      />
    </modal-dialog>

    <video ref="videoTag" autoplay="true" id="video"></video>
  </div>
</template>

<script>

/**
 * @file Master slide “camera”
 *
 * To create virtual video devices on linux run this commands:
 *
 * <code><pre>
 * sudo apt install v4l2loopback-dkms
 * sudo apt install apt install v4l2loopback-utils
 * sudo modprobe v4l2loopback devices=4
 *
 * # Capture desktop
 * ffmpeg -f x11grab -r 15 -s 1280x720 -i :0.0+0,0 -vcodec rawvideo -pix_fmt yuv420p -threads 0 -f v4l2 /dev/video0
 * /usr/share/backgrounds/Headstock_by_Bernhard_Hanakam.jpg
 * # Show image
 * ffmpeg -loop 1 -re -i image.jpg -f v4l2 -vcodec rawvideo -pix_fmt yuv420p /dev/video0
 *
 * # For example
 * ffmpeg -loop 1 -re -i /usr/share/backgrounds/Headstock_by_Bernhard_Hanakam.jpg -f v4l2 -vcodec rawvideo -pix_fmt yuv420p /dev/video0
 * ffmpeg -loop 1 -re -i /usr/share/backgrounds/More_Kamikochi_by_mendhak.jpg  -f v4l2 -vcodec rawvideo -pix_fmt yuv420p /dev/video1
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
 * <code><pre>
 * navigator.mediaDevices.enumerateDevices()
 * [
 *   {
 *     "deviceId": "21c19a409344f4bee3a71d7b1b14d1bb452dcd86cba8c9c5136a992c33241c08",
 *     "kind": "videoinput",
 *     "label": "USB Webcam (0bda:5727)",
 *     "groupId": ""
 *   }
 * ]
 * </pre></code>
 *
 * @module @bldr/master-camera
 */

import { mapGetters } from 'vuex'

export const master = {}

export default {
  data () {
    return {
      deviceId: '',
      stream: null
    }
  },
  computed: mapGetters(['mediaDevicesDynamicSelect']),
  methods: {
    setDeviceId () {
      this.$modal.hide('select-video-device')
      const constraints = {
        audio: false,
        video: { deviceId: { exact: this.deviceId.id } }
      }
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
          this.$refs.videoTag.srcObject = stream
          this.stream = stream
          this.$store.dispatch('setMediaDevices')
        })
        .catch(function (error) {
          throw error
        })
    },
    stopVideoStream () {
      if (this.stream) {
        this.stream.getTracks().forEach(track => {
          track.stop()
        })
      }
    },
    setFullScreen () {
      this.$refs.videoTag.requestFullscreen()
    }
  },
  created () {
    this.$slidePadding.set(0)
    this.$darkMode.set(true)
    this.setVideoStream()
    this.$shortcuts.add('c s', () => { this.showDeviceSelect() }, 'Dokumentenkamera auswählen')
    this.$shortcuts.add('c d', () => { this.stopVideoStream() }, 'Video-Ausgabegerät deaktivieren')
    this.$shortcuts.add('c f', () => { this.setFullScreen() }, 'Fullscreen')
  }
}
</script>

<style lang="scss" scoped>
  .camera-master {
    video {
      height: 100vh;
      left: 0;
      object-fit: contain;
      position: absolute;
      top: 0;
      width: 100vw;
    }
  }
</style>
