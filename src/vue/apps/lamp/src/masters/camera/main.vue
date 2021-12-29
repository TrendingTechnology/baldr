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

    <div id="video-wrapper" />

    <div v-if="!stream" class="no-stream">
      <plain-icon v-if="!cameraNotFound" name="document-camera" />
      <plain-icon v-if="cameraNotFound" name="document-camera-off" />
      <div>
        <a v-if="!stream" href="#" @click="showDeviceSelect"
          >Dokumentenkamera auswählen</a
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'

import MasterMain from '../MasterMain.vue'
import ExternalSites from '@/components/reusable/ExternalSites.vue'

interface MediaDevice {
  name: string
  id: string
}

@Component({
  components: {
    ExternalSites
  }
})
export default class CameraMasterMain extends MasterMain {
  masterName = 'camera'

  data (): {
    device: MediaDevice
    stream: MediaStream
    labelDefaultCamera: string
  } {
    return {
      // for v-model of dynamic select
      device: null,
      // if we have a camera but no stream
      stream: null,
      labelDefaultCamera: null
    }
  }

  device: MediaDevice
  stream: MediaStream
  labelDefaultCamera: string

  get mediaDevices (): MediaDevice[] {
    return this.$store.getters['lamp/masters/camera/forDynamicSelect']
  }

  get cameraNotFound (): boolean {
    return this.$store.getters['lamp/masters/camera/cameraNotFound']
  }

  /**
   * Called by the input event of the dynamic select component.
   */
  async setDeviceId (): Promise<void> {
    this.$modal.hide('select-video-device')
    this.labelDefaultCamera = this.device.name
    window.localStorage.setItem('labelDefaultCamera', this.device.name)
    this.$store.commit('lamp/masters/camera/setDeviceId', this.device.id)
    this.setVideoStream(await this.buildConstraints(this.device.id))
  }

  /**
   * Show the modal dialog with the dynamic select form element.
   */
  showDeviceSelect (): void {
    this.$store.dispatch('lamp/masters/camera/setMediaDevices')
    this.$modal.toggle('select-video-device')
    this.$dynamicSelect.focus()
  }

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
   * @returns - The device ID
   */
  async getDeviceId (): Promise<string> {
    const devices = await navigator.mediaDevices.enumerateDevices()
    for (const device of devices) {
      if (device.label === this.labelDefaultCamera) {
        return device.deviceId
      }
    }
  }

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
  async buildConstraints (deviceId?: string): Promise<MediaStreamConstraints> {
    if (deviceId == null) {
      deviceId = await this.getDeviceId()
    }
    if (deviceId != null) {
      return {
        audio: false,
        video: { deviceId: { exact: deviceId } }
      }
    } else {
      this.$store.commit('lamp/masters/camera/setCameraNotFound', true)
    }
  }

  /**
   * Try multiple times to get a camera stream.
   */
  async getStream (
    constraints: MediaStreamConstraints
  ): Promise<MediaStream | undefined> {
    for (let index = 0; index < 3; index++) {
      try {
        return await navigator.mediaDevices.getUserMedia(constraints)
      } catch (error) {
        // console.log(error)
      }
    }
  }

  /**
   * @param constraints
   *
   * ```js
   * {
   *   audio: false,
   *   video: { deviceId: { exact: '4V7Fv34Bp...' } }
   * }
   * ```
   */
  async setVideoStream (constraints?: MediaStreamConstraints): Promise<void> {
    const wrapperElement = document.querySelector(
      '.vc_camera_master #video-wrapper'
    )
    if (wrapperElement.firstChild) {
      return
    }

    let videoElement = this.$store.getters['lamp/masters/camera/videoElement']

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
      this.$store.commit('lamp/masters/camera/setVideoElement', videoElement)
      this.$store.dispatch('lamp/masters/camera/setMediaDevices')
    } else {
      this.$store.commit('lamp/masters/camera/setCameraNotFound', true)
    }
  }

  async mounted (): Promise<void> {
    this.labelDefaultCamera = window.localStorage.getItem('labelDefaultCamera')
    if (!this.labelDefaultCamera) {
      this.$store.commit('lamp/masters/camera/setCameraNotFound', true)
    } else {
      await this.setVideoStream()
    }
    this.$shortcuts.addMultiple([
      {
        keys: 'ctrl+c+s',
        callback: this.showDeviceSelect,
        description: 'Dokumentenkamera auswählen'
      }
    ])
  }
}
</script>

<style lang="scss">
.vc_camera_master {
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
