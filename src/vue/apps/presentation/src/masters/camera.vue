<template>
  <div class="vc_camera_master">
    <modal-dialog name="select-video-device">
      <dynamic-select
        placeholder="Wähle eine Dokumentenkamera aus"
        :options="mediaDevices"
        @input="setDeviceId"
        v-model="deviceId"
      />
    </modal-dialog>

    <video v-show="stream" ref="videoTag" autoplay="true" id="video"></video>

    <div v-if="!stream" class="no-stream">
      <plain-icon v-if="!cameraNotFound" name="document-camera"/>
      <plain-icon v-if="cameraNotFound" name="document-camera-off"/>
      <div>
        <a v-if="!stream" href="#" @click="showDeviceSelect">Dokumentenkamera auswählen</a>
      </div>
    </div>

  </div>
</template>

<script>

/**
 * @file Master slide “camera”
 *
 * To create virtual video devices on linux run this commands:
 *
 * ```
 * sudo apt install v4l2loopback-dkms
 * sudo apt install apt install v4l2loopback-utils
 * sudo modprobe v4l2loopback devices=4
 * ```
 *
 * # Capture desktop
 *
 * ```
 * ffmpeg -f x11grab -r 15 -s 1280x720 -i :0.0+0,0 -vcodec rawvideo -pix_fmt yuv420p -threads 0 -f v4l2 /dev/video0
 * ```
 *
 * # Show image
 *
 * ```
 * ffmpeg -loop 1 -re -i image.jpg -f v4l2 -vcodec rawvideo -pix_fmt yuv420p /dev/video0
 * ```
 *
 * # For example
 *
 * ```
 * ffmpeg -loop 1 -re -i /usr/share/backgrounds/Headstock_by_Bernhard_Hanakam.jpg -f v4l2 -vcodec rawvideo -pix_fmt yuv420p /dev/video0
 * ffmpeg -loop 1 -re -i /usr/share/backgrounds/More_Kamikochi_by_mendhak.jpg  -f v4l2 -vcodec rawvideo -pix_fmt yuv420p /dev/video1
 * ```
 *
 * # Show video
 *
 * ```
 * ffmpeg -re -i video.mp4 -f v4l2 /dev/video2
 * ```
 *
 * https://webrtc.github.io/samples/
 *
 * ```js
 * mediaStream.getVideoTracks()[0].getConstraints()
 * ```
 *
 * ```js
 * navigator.mediaDevices.getSupportedConstraints()
 * ```
 *
 * ```json
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
 * ```
 *
 * ```js
 * navigator.mediaDevices.enumerateDevices()
 * ```
 *
 * ```json
 * [
 *   {
 *     "deviceId": "21c19a409344f4bee3a71d7b1b14d1bb452dcd86cba8c9c5136a992c33241c08",
 *     "kind": "videoinput",
 *     "label": "USB Webcam (0bda:5727)",
 *     "groupId": ""
 *   }
 * ]
 * ```
 *
 * Secure contexts:
 *
 * Chrome
 *
 * Also you can add whiltelist by open chrome://flags and search for unsafely-treat-insecure-origin-as-secure:
 * chrome://flags/#unsafely-treat-insecure-origin-as-secure
 */

const example = `
---
slides:
  - title: Camera
    camera: yes
`

const state = {
  mediaDevices: [],
  deviceId: '',
  stream: null,
  cameraNotFound: false
}

const getters = {
  allMediaDevices: state => {
    return state.mediaDevices
  },
  forDynamicSelect: (state, getters) => {
    const resultList = []
    for (const device of getters.allMediaDevices) {
      if (device.kind === 'videoinput') {
        let label
        if (device.label) {
          label = device.label
        } else {
          label = `${device.kind} (${device.deviceId})`
        }
        resultList.push({
          id: device.deviceId,
          name: label
        })
      }
    }
    return resultList
  },
  cameraNotFound: state => {
    return state.cameraNotFound
  }
}

const actions = {
  async setMediaDevices ({ commit }) {
    commit('setMediaDevices', await navigator.mediaDevices.enumerateDevices())
  }
}

const mutations = {
  setMediaDevices (state, mediaDevices) {
    state.mediaDevices = mediaDevices
  },
  setDeviceId (state, deviceId) {
    state.deviceId = deviceId
  },
  setStream (state, stream) {
    state.stream = stream
  },
  setCameraNotFound (state, cameraNotFound) {
    state.cameraNotFound = cameraNotFound
  }
}

export const master = {
  title: 'Dokumentenkamera',
  icon: 'document-camera',
  color: 'red',
  styleConfig: {
    darkMode: true,
    contentTheme: 'default'
  },
  example,
  store: {
    state,
    getters,
    actions,
    mutations
  }
}

/**
 * @vue-data {String} deviceId
 * @vue-data {String} stream
 */
export default {
  data () {
    return {
      deviceId: '',
      stream: null
    }
  },
  computed: {
    mediaDevices () {
      return this.$store.getters['camera/forDynamicSelect']
    },
    cameraNotFound () {
      return this.$store.getters['camera/cameraNotFound']
    }
  },
  methods: {
    setDeviceId () {
      this.$modal.hide('select-video-device')
      const constraints = {
        audio: false,
        video: { deviceId: { exact: this.deviceId.id } }
      }
      this.$store.commit('camera/setDeviceId', this.deviceId.id)
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
          this.$store.commit('camera/setStream', stream)
          this.$store.dispatch('camera/setMediaDevices')
        })
        .catch(() => {
          this.$store.commit('camera/setCameraNotFound', true)
        })
    },
    stopVideoStream () {
      if (this.stream) {
        this.stream.getTracks().forEach(track => {
          track.stop()
        })
      }
    }
  },
  created () {
    this.setVideoStream()
    this.$shortcuts.add(
      'c s',
      () => { this.showDeviceSelect() },
      'Dokumentenkamera auswählen'
    )
    this.$shortcuts.add(
      'c d',
      () => { this.stopVideoStream() },
      'Video-Ausgabegerät deaktivieren'
    )
  }
}
</script>

<style lang="scss" scoped>
  .vc_camera_master {
    font-size: 1.5vw;

    video {
      height: 100vh;
      left: 0;
      object-fit: contain;
      position: absolute;
      top: 0;
      width: 100vw;
    }

    .no-stream {
      width: 100%;
      text-align: center;
    }

    .baldr-icon_document-camera,
    .baldr-icon_document-camera-off {
      font-size: 30vw;
    }
  }
</style>
