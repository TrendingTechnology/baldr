
/**
 * A REST API to save states of the seating plan app.
 * @module @bldr/api-seating-plan
 */

// Third party packages.
const express = require('express')

// Project packages.
const packageJson = require('../package.json')

/**
 *
 */
function registerRestApi (db) {
  const app = express()

  app.get('/version', (req, res) => {
    res.status(200).send({
      name: packageJson.name,
      version: packageJson.version
    })
  })

  app.post('/', (req, res) => {
    const body = req.body

    if (!{}.hasOwnProperty.call(body, 'timeStampMsec')) {
      res.sendStatus(404)
    }

    db.collection("seatingPlan").insertOne(body)

    const responseMessage = {
      success: body.timeStampMsec,
      storedObject: body
    }
    res.json(responseMessage)
    console.log(responseMessage)
  })

  app.get('/', (req, res) => {
    const states = []

    res.status(200).send(states)
  })

  app.get('/latest', (req, res) => {
  })

  app.get('/by-time/:timeStampMsec', (req, res) => {
    const timeStampMsec = req.params.timeStampMsec
    const state = getStateByTimeStampMsec(timeStampMsec)
    if (state) {
      res.status(200).send(state)
    } else {
      res.sendStatus(404)
    }
  })

  app.delete('/by-time/:timeStampMsec', (req, res) => {
    const timeStampMsec = req.params.timeStampMsec
    const storePath = timeStampMsecToPath(timeStampMsec)
  })

  return app
}

module.exports = {
  registerRestApi
}
