#! /usr/bin/env node

/**
 * A websocket server to connect multiple baldr lamp sessions.
 *
 * @see {@link module:@bldr/lamp/remote-control}
 * @see {@link https://www.npmjs.com/package/ws Package “ws” on npm}
 * @see {@link https://github.com/websockets/ws/blob/master/doc/ws.md API documentation of the package “ws”}
 *
 * @module @bldr/wire
 */

// Third party packages.
import WebSocket from 'ws'

// Globals.
import { getConfig } from '@bldr/config'

const config = getConfig()

/**
 * Launch the web socket server.
 */
function main (): void {
  const webSocketServer = new WebSocket.Server({ port: config.wire.port })

  webSocketServer.on('connection', function connection (webSocket) {
    webSocket.on('message', function incoming (message) {
      console.log('received: %s', message)
      // https://github.com/websockets/ws#server-broadcast
      webSocketServer.clients.forEach(function each (client) {
        if (client !== webSocket && client.readyState === WebSocket.OPEN) {
          client.send(message)
        }
      })
    })
  })
}

if (require.main === module) {
  main()
}
