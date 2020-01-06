<template>
  <div class="vc_camera_master">
    <modal-dialog name="select-video-device">
      <dynamic-select
        placeholder="Wähle eine Dokumentenkamera aus"
        :options="mediaDevices"
        @input="setDeviceId"
        v-model="device"
      />
    </modal-dialog>

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
      device: '',
      stream: null,
      globalVideoElement: null
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
    /**
     * Called by the input event of the dynamic select component.
     */
    async setDeviceId () {
      this.$modal.hide('select-video-device')
      console.log(this.device)
      this.$store.commit('camera/setDeviceId', this.device.id)
      this.setVideoStream(await this.buildConstraints(this.device.id))
    },
    /**
     * Show the modal dialog with the dynamic select form element.
     */
    showDeviceSelect () {
      this.$store.dispatch('camera/setMediaDevices')
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
      // ELMO
      const label = config.presentation.camera
      for (const device of devices) {
        if (device.kind === 'videoinput' && device.label.indexOf('label') > -1) {
          return device.Id
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
        return { audio: false, video: true }
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
      if (this.globalVideoElement.srcObject) {
        return true
      }
      if (!constraints) {
        constraints = await this.buildConstraints()
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints)
        this.globalVideoElement.srcObject = stream
        this.stream = stream
        this.$store.commit('camera/setStream', stream)
        this.$store.dispatch('camera/setMediaDevices')
      } catch (error) {
        console.log(error)
        this.$store.commit('camera/setCameraNotFound', true)
      }
    },
    stopVideoStream () {
      if (this.stream) {
        this.stream.getTracks().forEach(track => {
          track.stop()
        })
      }
    },
    /**
     * Get the global video element. The elements is created if it
     * does not exist.
     *
     * @returns {HtmlElement}
     */
    getGlobalVideoElement () {
      const idGlobalVideoElement = 'camera-master-video'
      let globalVideoElement = document.querySelector(`#${idGlobalVideoElement}`)
      // Is null if not created yet.
      if (!globalVideoElement) {
        const globalZone = document.querySelector('#global-zone')
        globalVideoElement = document.createElement('video')
        globalVideoElement.autoplay = true
        globalVideoElement.id = idGlobalVideoElement
        globalZone.appendChild(globalVideoElement)
      }
      return globalVideoElement
    },
    showGlobalVideoElement () {
      this.globalVideoElement.style.display = 'block'
    },
    hideGlobalVideoElement () {
      this.globalVideoElement.style.display = 'none'
    },
  },
  async mounted () {
    this.globalVideoElement = this.getGlobalVideoElement()
    await this.setVideoStream()
    this.showGlobalVideoElement()
    this.$shortcuts.addMultiple([
      {
        keys: 'c s',
        callback: this.showDeviceSelect,
        description: 'Dokumentenkamera auswählen'
      },
      {
        keys: 'c d',
        callback: this.stopVideoStream,
        description: 'Video-Ausgabegerät deaktivieren'
      },
      {
        keys: 'c r',
        callback: this.setVideoStream,
        description: 'Nach der Dokumentenkamera suchen',
      },
      {
        keys: 'c e',
        callback: this.setDeviceId,
        description: 'ELMO auswählen',
      }
    ])
  },
  destroyed () {
    this.hideGlobalVideoElement()
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
