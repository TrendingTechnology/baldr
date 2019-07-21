#! /usr/bin/env node

// Node packages.
const fs = require('fs')
const path = require('path')
const os = require('os')

// Third party packages.
const { Command } = require('commander')
const cors = require('cors')
const express = require('express')

// Project packages.
const packageJson = require('./package.json')

const DEFAULT_PORT = 46328
let store
let port
let server

function timeStampMsecToPath (timeStampMsec) {
  return path.join(store, `seating-plan_${timeStampMsec}.json`)
}

const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/version', (req, res) => {
  res.status(200).send({
    version: packageJson.version
  })
})

app.post('/api/seating-plan', (req, res) => {
  const timeStampMsec = new Date().getTime()
  const body = JSON.stringify(req.body)
  fs.writeFile(
    timeStampMsecToPath(timeStampMsec),
    body,
    { encoding: 'utf-8' },
    (err) => {
      if (err) throw err
      console.log('The file has been saved!')
    }
  )

  const responseMessage = {
    timeStampMsec: timeStampMsec,
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

app.get('/api/seating-plan/:timeStampMsec', (req, res) => {
  const timeStampMsec = req.params.timeStampMsec
  const storePath = timeStampMsecToPath(timeStampMsec)
  if (fs.existsSync(storePath)) {
    const jsonString = fs.readFileSync(storePath, { encoding: 'utf-8' })
    res.status(200).send(JSON.parse(jsonString))
  } else {
    res.sendStatus(404)
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
  } else if ({}.hasOwnProperty.call(process.env, 'BALDR_REST_API_STORE') &&
             process.env.BALDR_REST_API_STORE) {
    store = process.env.BALDR_REST_API_STORE
  } else {
    store = fs.mkdtempSync(path.join(os.tmpdir(), 'baldr-rest-api-'))
  }

  if (options.port) {
    port = options.port
  } else if ({}.hasOwnProperty.call(process.env, 'BALDR_REST_API_PORT') &&
             process.env.BALDR_REST_API_PORT) {
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
