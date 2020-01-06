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
      deviceId: '',
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
      this.$store.dispatch('camera/setMediaDevices')
      this.$modal.toggle('select-video-device')
      this.$dynamicSelect.focus()
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
    setVideoStream (constraints) {
      if (!constraints) {
        constraints = { audio: false, video: true }
      }
      // {fdf4c841-b6e0-4754-8074-e1d540ac5018}
      // "4V7Fv34BpWsE9EX1Y718KLZVUyifnZrZo7bUTxCz6XU="
      navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
          if (!this.globalVideoElement.srcObject) {
            this.globalVideoElement.srcObject = stream
            this.stream = stream
            this.$store.commit('camera/setStream', stream)
            this.$store.dispatch('camera/setMediaDevices')
          }
        })
        .catch((error) => {
          console.log(error)
          this.$store.commit('camera/setCameraNotFound', true)
        })
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
  mounted () {
    this.globalVideoElement = this.getGlobalVideoElement()
    this.showGlobalVideoElement()
    this.setVideoStream()
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
