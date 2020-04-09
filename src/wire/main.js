#! /usr/bin/env node

const WebSocket = require('ws')

function main () {
  const wss = new WebSocket.Server({ port: 62453 })

  wss.on('connection', function connection (ws) {
    ws.on('message', function incoming (message) {
      console.log('received: %s', message)
    })

    ws.send('something')
  })
}

if (require.main === module) {
  main()
}
