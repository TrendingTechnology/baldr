#! /usr/bin/env node

/**
 * A websocket server to connect multiple baldr lamp sessions.
 *
 * @module @bldr/wire
 */

const WebSocket = require('ws')

const core = require('@bldr/core-node')

const config = core.bootstrapConfig()

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
