#! /usr/bin/env node

// Node packages.
const fs = require('fs')
const path = require('path')
const os = require('os')

// Third party packages.
const { Command } = require('commander')
// We do CORS now over Nginx
// const cors = require('cors')
const express = require('express')

// Project packages.
const packageJson = require('./package.json')
const { MediaServer } = require('@bldr/media-server')
const mediaServer = new MediaServer()

/**
 * Default TCP port the server listens on.
 */
const DEFAULT_PORT = 46328

/**
 * Directory where to store the json state objects.
 */
let store

/**
 * TCP Port on which the express js server listens on.
 */
let port

/**
 * Express js server instance. Returned by app.listen()
 */
let server

function timeStampMsecToPath (timeStampMsec) {
  return path.join(store, `seating-plan_${timeStampMsec}.json`)
}

function getStateByTimeStampMsec (timeStampMsec) {
  const storePath = timeStampMsecToPath(timeStampMsec)
  if (fs.existsSync(storePath)) {
    const jsonString = fs.readFileSync(storePath, { encoding: 'utf-8' })
    return JSON.parse(jsonString)
  }
  return false
}

function checkEnv (envName) {
  if ({}.hasOwnProperty.call(process.env, envName) && process.env[envName]) {
    return true
  }
  return false
}

const app = express()

// We do CORS now over Nginx
// app.use(cors())
app.use(express.json())

app.get('/api/version', (req, res) => {
  res.status(200).send({
    version: packageJson.version
  })
})

app.post('/api/seating-plan', (req, res) => {
  const body = req.body

  if (!{}.hasOwnProperty.call(body, 'timeStampMsec')) {
    res.sendStatus(404)
  }

  fs.writeFile(
    path.join(store, 'latest'),
    body.timeStampMsec,
    { encoding: 'utf-8' },
    (err) => {
      if (err) throw err
      console.log('The file has been saved!')
    }
  )

  fs.writeFile(
    timeStampMsecToPath(body.timeStampMsec),
    JSON.stringify(req.body),
    { encoding: 'utf-8' },
    (err) => {
      if (err) throw err
      console.log('The file has been saved!')
    }
  )

  const responseMessage = {
    success: body.timeStampMsec,
    storedObject: req.body
  }
  res.json(responseMessage)
  console.log(responseMessage)
})

app.get('/api/seating-plan', (req, res) => {
  const states = []
  fs.readdirSync(store).forEach(file => {
    const regExp = /seating-plan_(\d+)\.json/g
    const match = regExp.exec(file)
    if (match) {
      states.push(match[1])
    }
  })
  res.status(200).send(states)
})

app.get('/api/seating-plan/latest', (req, res) => {
  const latestPath = path.join(store, 'latest')
  if (fs.existsSync(latestPath)) {
    const latest = fs.readFileSync(latestPath, { encoding: 'utf-8' })
    const state = getStateByTimeStampMsec(Number(latest))
    res.status(200).send(state)
  } else {
    res.sendStatus(404)
  }
})

app.get('/api/seating-plan/by-time/:timeStampMsec', (req, res) => {
  const timeStampMsec = req.params.timeStampMsec
  const state = getStateByTimeStampMsec(timeStampMsec)
  if (state) {
    res.status(200).send(state)
  } else {
    res.sendStatus(404)
  }
})

app.delete('/api/seating-plan/by-time/:timeStampMsec', (req, res) => {
  const timeStampMsec = req.params.timeStampMsec
  const storePath = timeStampMsecToPath(timeStampMsec)
  if (fs.existsSync(storePath)) {
    fs.unlinkSync(storePath)
    res.status(200).send({ timeStampMsec: timeStampMsec })
  } else {
    res.sendStatus(404)
  }
})

app.post('/api/media-server/query-by-id', (req, res) => {
  const body = req.body
  if (!{}.hasOwnProperty.call(body, 'id')) {
    res.sendStatus(400)
  } else {
    const responeMessage = mediaServer.queryByID(body.id)
    res.json(responeMessage)
    console.log(responeMessage)
  }
})

app.post('/api/media-server/query-by-filename', (req, res) => {
  const body = req.body
  if (!{}.hasOwnProperty.call(body, 'filename')) {
    res.sendStatus(400)
  } else {
    const responeMessage = mediaServer.queryByFilename(body.filename)
    res.json(responeMessage)
    console.log(responeMessage)
  }
})

const main = function () {
  // To get a clean commander. Otherwise we get options from mocha in the tests.
  // https://github.com/tj/commander.js/issues/438#issuecomment-274285003
  const commander = new Command()
  const options = commander
    .version(packageJson.version)
    .option('-p, --port <port>', 'Port to listen to.')
    .option('-s, --store <store>', 'Directory to store the JSON dump files into.')
    .parse(process.argv)

  if (options.store) {
    store = options.store
  } else if (checkEnv('BALDR_REST_API_STORE')) {
    store = process.env.BALDR_REST_API_STORE
  } else {
    store = fs.mkdtempSync(path.join(os.tmpdir(), 'baldr-rest-api-'))
  }

  if (options.port) {
    port = options.port
  } else if (checkEnv('BALDR_REST_API_PORT')) {
    port = process.env.BALDR_REST_API_PORT
  } else {
    port = DEFAULT_PORT
  }

  server = app.listen(port, () => {
    console.log(`The BALDR REST API is running on port ${port}.`)
    console.log(`The JSON dumps are stored into the directory ${store}.`)
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
  module.exports.store = store
  module.exports.port = port
}
