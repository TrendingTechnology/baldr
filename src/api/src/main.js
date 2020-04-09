#! /usr/bin/env node

/**
 * A REST API made with express.js. The sub apps are outsourced in different modules.
 *
 * @module @bldr/api
 */

// Third party packages.
const cors = require('cors')
const express = require('express')
const registerSeatingPlan = require('@bldr/api-seating-plan').registerRestApi
const registerMediaServer = require('@bldr/media-server').registerRestApi
const helpMessagesMediaServer = require('@bldr/media-server').helpMessages

// Project packages.
const packageJson = require('../package.json')
const { bootstrapConfig } = require('@bldr/core-node')

const config = bootstrapConfig()

/**
 * Express js server instance. Returned by app.listen()
 */
let server

/**
 * Run the REST API. Listen to a TCP port.
 *
 * @param {Number} port - A TCP port.
 */
const run = function (port) {
  const app = express()

  app.use(cors())
  app.use(express.json())

  app.use('/seating-plan', registerSeatingPlan())
  app.use('/media', registerMediaServer())

  const helpMessages = {
    version: {
      name: packageJson.name,
      version: packageJson.version
    }
  }

  app.get('/', (req, res) => {
    res.json({
      version: helpMessages.version,
      navigation: {
        media: helpMessagesMediaServer.navigation
      }
    })
  })

  app.get('/version', (req, res) => {
    res.json(helpMessages.version)
  })

  if (!port) {
    port = config.api.port
  }
  server = app.listen(port, () => {
    console.log(`The BALDR REST API is running on port ${port}.`)
  })
  return app
}

/**
 * Stop the REST API.
 */
const stop = function () {
  server.close()
}

const main = function () {
  let port
  if (process.argv.length === 3) port = process.argv[2]
  return run(port)
}

if (require.main === module) {
  main()
}
