/**
 * To create virtual video devices on linux run this commands:
 *
 * ```
 * sudo apt install v4l2loopback-dkms
 * sudo apt install v4l2loopback-utils
 * sudo modprobe v4l2loopback devices=2
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
 * # For example
 *
 * ```
 * ffmpeg -re -i /var/data/baldr/media/09/10_Romantik/10_Programmmusik/60_Berlioz-Symphonie-fantasique/Hector-Berlioz_Arte-Dokumentation.mp4 -f v4l2 /dev/video1
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
 *
 * @module @bldr/presentation/masters/camera
 */

import { validateMasterSpec } from '../../lib/masters'
export default validateMasterSpec({
  name: 'camera',
  title: 'Dokumentenkamera',
  icon: {
    name: 'master-camera',
    color: 'red'
  },
  styleConfig: {
    darkMode: true,
    contentTheme: 'default',
    centerVertically: true
  }
})
