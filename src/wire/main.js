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
const WebSocket = require('ws')

// Project packages.
const core = require('@bldr/core-node')

// Globals.
const config = core.bootstrapConfig()

/**
 * Launch the web socket server.
 */
function main () {
  const wss = new WebSocket.Server({ port: config.wire.port })

  wss.on('connection', function connection (ws) {
    ws.on('message', function incoming (message) {
      console.log('received: %s', message)
      wss.clients.forEach(function each (client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message)
        }
      })
    })
  })
}

if (require.main === module) {
  main()
}
