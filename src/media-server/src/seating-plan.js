
/**
 * A REST API to save states of the seating plan app.
 * @module @bldr/api-seating-plan
 */

// Third party packages.
const express = require('express')

// Project packages.
const packageJson = require('../package.json')

/**
 * @param {module:@bldr/media-server/database.Database} database
 */
function registerRestApi (database) {
  const db = database.db
  const app = express()

  app.get('/version', (req, res) => {
    res.status(200).send({
      name: packageJson.name,
      version: packageJson.version
    })
  })

  app.post('/save-state', (req, res) => {
    const body = req.body

    if (!{}.hasOwnProperty.call(body, 'timeStampMsec')) {
      res.sendStatus(404)
    }

    db.collection('seatingPlan').insertOne(body)

    const responseMessage = {
      success: body.timeStampMsec,
      storedObject: body
    }
    res.json(responseMessage)
    console.log(responseMessage)
  })

  app.get('/get-states', (req, res) => {
    db.collection('seatingPlan').aggregate([{ $match: {} }, { $project: { timeStampMsec: 1, _id: 0 } }]).toArray((error, result) => {
      if (error) {
        return res.status(500).send(error)
      }
      const states = []
      for (const state of result) {
        states.push(state.timeStampMsec)
      }
      res.status(200).send(states)
    })
  })

  app.get('/latest', (req, res) => {
    db.collection('seatingPlan').find().sort({ timeStampMsec: -1 }).limit(1).toArray((error, result) => {
      if (error) {
        return res.status(500).send(error)
      }
      if (result.length > 0) {
        res.status(200).send(result[0])
      } else {
        res.status(200).send('')
      }
    })
  })

  app.get('/get-state-by-time/:timeStampMsec', (req, res) => {
    db.collection('seatingPlan').find({ timeStampMsec: parseInt(req.params.timeStampMsec) }).toArray((error, result) => {
      if (error) {
        return res.status(500).send(error)
      }
      res.status(200).send(result)
    })
  })

  app.delete('/delete-state-by-time/:timeStampMsec', (req, res) => {
    // const timeStampMsec = req.params.timeStampMsec
  })

  return app
}

module.exports = {
  registerRestApi
}
