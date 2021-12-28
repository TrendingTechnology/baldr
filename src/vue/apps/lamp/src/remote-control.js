/**
 * In the speaker view all to the websocket connected BALDR Lamp
 * instances are controlled.
 *
 * # Control message sender
 *
 * `this.$socket.sendObj()`
 *
 * # Listener
 *
 * in `MainApp.vue` in the lifecyle hook `mounted` the socket event listener
 * `this.$options.sockets.onmessage` is bound to a function.
 *
 * # Used plugins:
 *
 * @see {@link module:@bldr/wire Web sockets server}
 * @see {@link https://www.npmjs.com/package/vue-native-websocket Used Vue plugin “vue-native-websocket”}
 *
 * @module @bldr/lamp/remote-control
 */

import { router } from './lib/router-setup'

/**
 * @param {Object} message
 */
export function receiveSocketMessage (message) {
  const msg = JSON.parse(message.data)
  if (msg.route) {
    router.push(msg.route)
  }
}
