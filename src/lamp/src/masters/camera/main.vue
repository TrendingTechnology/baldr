<template>
  <div class="vc_camera_master">
    <modal-dialog name="select-video-device">
      Standard-Dokumenten-Kamera: {{ labelDefaultCamera }}
      <dynamic-select
        placeholder="Wähle eine Dokumentenkamera aus"
        :options="mediaDevices"
        @input="setDeviceId"
        v-model="device"
      />

    </modal-dialog>

    <div id="video-wrapper"/>

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
 * @vue-data {String} deviceId
 * @vue-data {String} stream
 *
 * @component
 */
export default {
  data () {
    return {
      // for v-model of dynamic select
      device: '',
      // if we have a camera but no stream
      stream: null,
      labelDefaultCamera: null
    }
  },
  computed: {
    mediaDevices () {
      return this.$store.getters['lampMasterCamera/forDynamicSelect']
    },
    cameraNotFound () {
      return this.$store.getters['lampMasterCamera/cameraNotFound']
    }
  },
  methods: {
    /**
     * Called by the input event of the dynamic select component.
     */
    async setDeviceId () {
      this.$modal.hide('select-video-device')
      this.labelDefaultCamera = this.device.name
      window.localStorage.setItem('labelDefaultCamera', this.device.name)
      this.$store.commit('lampMasterCamera/setDeviceId', this.device.id)
      this.setVideoStream(await this.buildConstraints(this.device.id))
    },
    /**
     * Show the modal dialog with the dynamic select form element.
     */
    showDeviceSelect () {
      this.$store.dispatch('lampMasterCamera/setMediaDevices')
      this.$modal.toggle('select-video-device')
      this.$dynamicSelect.focus()
    },
    /**
     * Get the device ID of the document camera. Search for the
     * name of the camera. The camera name can be specified in the
     * configuration file `/etc/baldr.json.`
     *
     * ```json
     * {
     *   "presentation": {
     *     "camera": "ELMO"
     *   }
     * }
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
     * @returns {String} - The device ID
     */
    async getDeviceId () {
      const devices = await navigator.mediaDevices.enumerateDevices()
      for (const device of devices) {
        if (device.label === this.labelDefaultCamera) {
          return device.deviceId
        }
      }
    },

    /**
     * Build the constraints object of the method
     * `navigator.mediaDevices.getUserMedia(constraints)`.
     *
     * @returns {Object}
     *
     * If a device ID can be found:
     *
     * ```js
     * {
     *   audio: false,
     *   video: { deviceId: { exact: '4V7Fv34Bp...' } }
     * }
     * ```
     *
     * If no device ID can be found:
     *
     * ```js
     * {
     *   audio: false,
     *   video: true
     * }
     * ```
     */
    async buildConstraints (deviceId) {
      if (!deviceId) deviceId = await this.getDeviceId()
      if (deviceId) {
        return {
          audio: false,
          video: { deviceId: { exact: deviceId } }
        }
      } else {
        this.$store.commit('lampMasterCamera/setCameraNotFound', true)
      }
    },
    /**
     * Try multiple times to get a camera stream.
     */
    async getStream (constraints) {
      for (let index = 0; index < 3; index++) {
        try {
          return await navigator.mediaDevices.getUserMedia(constraints)
        } catch (error) {
          // console.log(error)
        }
      }
    },
    /**
     * @param {constraints}
     *
     * ```js
     * {
     *   audio: false,
     *   video: { deviceId: { exact: '4V7Fv34Bp...' } }
     * }
     * ```
     */
    async setVideoStream (constraints) {
      const wrapperElement = document.querySelector('.vc_camera_master #video-wrapper')
      if (wrapperElement.firstChild) {
        return
      }

      let videoElement = this.$store.getters['lampMasterCamera/videoElement']

      if (videoElement) {
        videoElement.play()
        wrapperElement.appendChild(videoElement)
        return
      } else {
        videoElement = document.createElement('video')
        videoElement.autoplay = true
      }

      if (!constraints) {
        constraints = await this.buildConstraints()
      }
      const stream = await this.getStream(constraints)
      if (stream) {
        videoElement.srcObject = stream
        this.stream = stream
        wrapperElement.appendChild(videoElement)
        this.$store.commit('lampMasterCamera/setVideoElement', videoElement)
        this.$store.dispatch('lampMasterCamera/setMediaDevices')
      } else {
        this.$store.commit('lampMasterCamera/setCameraNotFound', true)
      }
    }
  },
  async mounted () {
    this.labelDefaultCamera = window.localStorage.getItem('labelDefaultCamera')
    if (!this.labelDefaultCamera) {
      this.$store.commit('lampMasterCamera/setCameraNotFound', true)
    } else {
      await this.setVideoStream()
    }
    this.$shortcuts.addMultiple([
      {
        keys: 'c s',
        callback: this.showDeviceSelect,
        description: 'Dokumentenkamera auswählen'
      }
    ])
  }
}
</script>

<style lang="scss">
  .vc_camera_master {
    font-size: 1em;

    video {
      height: 100%;
      left: 0;
      object-fit: contain;
      position: absolute;
      top: 0;
      width: 100%;
    }

    .no-stream {
      width: 100%;
      text-align: center;
    }

    .baldr-icon_document-camera,
    .baldr-icon_document-camera-off {
      font-size: 25em;
    }
  }
</style>
