#! /usr/bin/env node

// Third party packages.
const { Command } = require('commander')
const cors = require('cors')
const express = require('express')
const registerSeatingPlan = require('@bldr/api-seating-plan').registerRestApi
const registerMediaServer = require('@bldr/api-media-server').registerRestApi

// Project packages.
const packageJson = require('../package.json')
const { utils } = require('@bldr/core')

const config = utils.bootstrapConfig()

/**
 * Default TCP port the server listens on.
 */
const DEFAULT_PORT = config.api.port

/**
 * TCP Port on which the express js server listens on.
 */
let port

/**
 * Express js server instance. Returned by app.listen()
 */
let server

const app = express()

app.use(cors())
app.use(express.json())

app.use('/seating-plan', registerSeatingPlan())
app.use('/media-server', registerMediaServer())

app.get(['/', '/version'], (req, res) => {
  res.status(200).send({
    name: packageJson.name,
    version: packageJson.version
  })
})

const main = function () {
  // To get a clean commander. Otherwise we get options from mocha in the tests.
  // https://github.com/tj/commander.js/issues/438#issuecomment-274285003
  const commander = new Command()
  const options = commander
    .version(packageJson.version)
    .option('-p, --port <port>', 'Port to listen to.')
    .parse(process.argv)

  if (options.port) {
    port = options.port
  } else {
    port = DEFAULT_PORT
  }

  server = app.listen(port, () => {
    console.log(`The BALDR REST API is running on port ${port}.`)
  })

  return app
}

const stop = function () {
  server.close()
}

if (require.main === module) {
  main()
} else {
  module.exports = main()
  module.exports.stop = stop
}
