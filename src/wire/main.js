#! /usr/bin/env node

/**
 * A websocket server to connect multiple baldr lamp sessions.
 *
 * @module @bldr/wire
 */

const WebSocket = require('ws')

function main () {
  const wss = new WebSocket.Server({ port: 62453 })

  wss.on('connection', function connection (ws) {
    ws.on('message', function incoming (message) {
      console.log('received: %s', message)
      wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(data);
        }
      })
    })

    ws.send('something')
  })
}

if (require.main === module) {
  main()
}
