#! /usr/bin/env node

// Third party packages.
const { Command } = require('commander')
const cors = require('cors')
const express = require('express')

// Project packages.
const packageJson = require('../package.json')
const { MediaServer, bootstrapConfig } = require('./index.js')
const mediaServer = new MediaServer()

let config = bootstrapConfig()

function sendJsonMessage (res, message) {
  res.json(message)
  console.log(message)
}

const app = express()

app.use(cors())
app.use(express.json())

app.get('/version', (req, res) => {
  sendJsonMessage(res, {
    version: packageJson.version
  })
})

app.post('/query-by-id', (req, res) => {
  const body = req.body
  if (!('id' in body)) {
    res.sendStatus(400)
  } else {
    sendJsonMessage(res, mediaServer.queryByID(body.id))
  }
})

app.post('/query-by-filename', (req, res) => {
  const body = req.body
  if (!{}.hasOwnProperty.call(body, 'filename')) {
    res.sendStatus(400)
  } else {
    sendJsonMessage(res, mediaServer.queryByFilename(body.filename))
  }
})

const main = function () {
  // To get a clean commander. Otherwise we get options from mocha in the tests.
  // https://github.com/tj/commander.js/issues/438#issuecomment-274285003
  const commander = new Command()
  const options = commander
    .version(packageJson.version)
    .option('-p, --port <port>', 'Port to listen to.')
    .parse(process.argv)

  let port
  if (options.port) {
    port = options.port
  } else {
    port = config.portRestApi
  }

  server = app.listen(port, () => {
    console.log(`The BALDR MEDIA SERVER REST API is running on port ${port}.`)
  })
}

if (require.main === module) {
  main()
}