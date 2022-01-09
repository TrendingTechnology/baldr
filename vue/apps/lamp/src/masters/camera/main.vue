<template>
  <div class="vc_camera_master">
    <!-- <modal-dialog name="select-video-device">
      Standard-Dokumenten-Kamera: {{ labelDefaultCamera }}
      <dynamic-select
        placeholder="Wähle eine Dokumentenkamera aus"
        :options="devicesForDynamicSelect"
        @input="setDeviceId"
        v-model="device"
      />
    </modal-dialog> -->

    <div ref="videoWrapper" />

    <div v-if="!videoElement" class="no-stream">
      <plain-icon v-if="!cameraNotFound" name="document-camera" />
      <plain-icon v-if="cameraNotFound" name="document-camera-off" />
      <div>
        <a v-if="!videoElement" href="#" @click="setVideoStream"
          >Dokumentenkamera auswählen</a
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable indent, no-undef */
import Component from 'vue-class-component'
import { createNamespacedHelpers } from 'vuex'

const { mapGetters } = createNamespacedHelpers('lamp/masters/camera')

// import { shortcutManager } from '@bldr/shortcuts'

import MasterMain from '../MasterMain.vue'

// interface MediaDeviceDynamicSelect {
//   name: string
//   id: string
// }

@Component({
  computed: mapGetters(['cameraNotFound', 'videoElement'])
})
export default class CameraMasterMain extends MasterMain {
  masterName = 'camera'
  videoElement!: HTMLVideoElement

  cameraNotFound!: boolean

  data (): {
    // devices: MediaDeviceInfo[]
    // device: MediaDeviceDynamicSelect
    // stream: MediaStream
    // labelDefaultCamera: string
  } {
    return {
      // devices: null,
      // for v-model of dynamic select
      // device: null,
      // if we have a camera but no stream
      // stream: null,
      // labelDefaultCamera: null
    }
  }

  // devices!: MediaDeviceInfo[]
  // device!: MediaDeviceDynamicSelect
  // stream!: MediaStream
  // labelDefaultCamera!: string

  $refs!: {
    videoWrapper: HTMLDivElement
  }

  // get devicesForDynamicSelect() {
  //   if (this.devices == null) {
  //     return
  //   }
  //   const resultList = []
  //   for (const device of this.devices) {
  //     if (device.kind === 'videoinput') {
  //       let label: string
  //       if (device.label) {
  //         label = device.label
  //       } else {
  //         label = `${device.kind} (${device.deviceId})`
  //       }
  //       resultList.push({
  //         ref: device.deviceId,
  //         name: label
  //       })
  //     }
  //   }
  //   return resultList
  // }

  // async setMediaDevices (): Promise<void> {
  //   this.devices = await navigator.mediaDevices.enumerateDevices()
  // }

  /**
   * Called by the input event of the dynamic select component.
   */
  // async setDeviceId (): Promise<void> {
  //   this.$modal.hide('select-video-device')
  //   this.labelDefaultCamera = this.device.name
  //   // window.localStorage.setItem('labelDefaultCamera', this.device.name)
  //   this.setVideoStream(await this.buildConstraints(this.device.id))
  // }

  /**
   * Show the modal dialog with the dynamic select form element.
   */
  // showDeviceSelect (): void {
  //   this.$modal.toggle('select-video-device')
  //   this.$dynamicSelect.focus()
  // }

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
  async getDeviceId (): Promise<string | undefined> {
    const devices = await navigator.mediaDevices.enumerateDevices()
    console.log(devices)
    for (const device of devices) {
      if (device.label.toLowerCase().includes('elmo')) {
        return device.deviceId
      }
    }
  }

  /**
   * Build the constraints object of the method
   * `navigator.mediaDevices.getUserMedia(constraints)`.
   *
   * @returns
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
  async buildConstraints (
    deviceId?: string
  ): Promise<MediaStreamConstraints | undefined> {
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
    if (this.$refs.videoWrapper.firstChild != null) {
      return
    }

    if (this.videoElement != null) {
      this.videoElement.play()
      this.$refs.videoWrapper.appendChild(this.videoElement)
      return
    } else {
      const videoElement = document.createElement('video')
      videoElement.autoplay = true
      this.$store.commit('lamp/masters/camera/setVideoElement', videoElement)
    }

    if (constraints == null) {
      constraints = await this.buildConstraints()
    }
    const stream = await this.getStream(constraints)
    console.log(stream)
    if (stream != null) {
      this.videoElement.srcObject = stream
      this.$refs.videoWrapper.appendChild(this.videoElement)
    } else {
      this.$store.commit('lamp/masters/camera/setCameraNotFound', true)
      this.$store.commit('lamp/masters/camera/setVideoElement', null)
    }
  }

  async mounted (): Promise<void> {
    // await this.setMediaDevices()
    // this.labelDefaultCamera = window.localStorage.getItem('labelDefaultCamera')
    // if (!this.labelDefaultCamera) {
    //   this.$store.commit('lamp/masters/camera/setCameraNotFound', true)
    // } else {
    await this.setVideoStream()
    // }
    // shortcutManager.add(
    //   'ctrl+c+s',
    //   this.showDeviceSelect,
    //   'Dokumentenkamera auswählen'
    // )
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
