<template>
  <div class="vc_camera_master">
    <div class="device-selection-area gradually-appear">
      <p>
        <button @click="findDevices">aktualisieren</button>
      </p>

      <h3>Gefundene Ausgabe-Geräte:</h3>

      <p
        v-for="device in devices"
        :key="device.deviceId"
        @click="setVideoStream(device.deviceId)"
      >
        <button>
          {{ device.titel }}
        </button>
      </p>
    </div>

    <div ref="videoWrapper" />

    <div v-if="!videoElement" class="no-stream">
      <plain-icon name="master-camera" />
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable indent, no-undef */
import Component from 'vue-class-component'
import MasterMain from '../MasterMain.vue'

interface SimpleMediaDeviceInfo {
  titel: string
  deviceId: string
}

let videoElement: undefined | HTMLVideoElement

@Component
export default class CameraMasterMain extends MasterMain {
  masterName = 'camera'

  data (): {
    devices: SimpleMediaDeviceInfo[]
  } {
    return {
      devices: null
    }
  }

  devices!: SimpleMediaDeviceInfo[]

  $refs!: {
    videoWrapper: HTMLDivElement
  }

  get videoElement (): HTMLVideoElement | undefined {
    return videoElement
  }

  /**
   * ```js
   * devices = await navigator.mediaDevices.enumerateDevices()
   *
   * devices = [
   *   {
   *     "deviceId": "21c19a409344f4bee3a71d7b1b14d1bb452dcd86cba8c9c5136a992c33241c08",
   *     "kind": "videoinput",
   *     "label": "USB Webcam (0bda:5727)",
   *     "groupId": ""
   *   }
   * ]
   * ```
   */
  async findDevices (): Promise<SimpleMediaDeviceInfo[]> {
    console.log('find devices')
    const devices = await navigator.mediaDevices.enumerateDevices()
    const videoDevices: SimpleMediaDeviceInfo[] = []
    for (const device of devices) {
      if (device.kind === 'videoinput') {
        console.log('found videoinput', devices)
        let titel: string
        if (device.label != null && device.label !== '') {
          titel = device.label
        } else {
          titel = device.deviceId.substring(0, 5)
        }
        videoDevices.push({
          deviceId: device.deviceId,
          titel
        })
      }
      this.devices = videoDevices
    }
    return videoDevices
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
  buildConstraints (deviceId: string): MediaStreamConstraints {
    return {
      audio: false,
      video: { deviceId: { exact: deviceId } }
    }
  }

  async getStream (
    constraints: MediaStreamConstraints
  ): Promise<MediaStream | undefined> {
    return await navigator.mediaDevices.getUserMedia(constraints)
  }

  stopStreamedVideo (): void {
    if (videoElement?.srcObject != null) {
      const stream = videoElement.srcObject as MediaStream
      const tracks = stream.getTracks()
      tracks.forEach(function (track: MediaStreamTrack): void {
        track.stop()
      })
      videoElement.srcObject = null
    }
  }

  async setVideoStream (deviceId: string): Promise<void> {
    console.log('Set device', deviceId)
    const constraints = this.buildConstraints(deviceId)
    const stream = await this.getStream(constraints)
    console.log('Got video stream', stream)

    if (stream != null) {
      this.stopStreamedVideo()
      videoElement = document.createElement('video')
      videoElement.autoplay = true
      videoElement.srcObject = stream
      this.$refs.videoWrapper.appendChild(videoElement)
    }
  }

  reuseVideoElement (): void {
    if (videoElement != null && this.$refs.videoWrapper != null) {
      videoElement.play()
      this.$refs.videoWrapper.appendChild(videoElement)
    }
  }

  async mounted (): Promise<void> {
    this.reuseVideoElement()
    await this.findDevices()
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

  .baldr-icon_master-camera,
  .baldr-icon_document-camera-off {
    font-size: 25em;
  }

  .device-selection-area {
    background-color: $white;
    color: $black;
    margin: 0.5em;
    padding: 1em;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 1;
  }
}
</style>
