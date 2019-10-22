#! /usr/bin/env node

/**
 * A REST API to save states of the seating plan app.
 * @module @bldr/api-seating-plan
 */

// Node packages.
const fs = require('fs')
const path = require('path')

// Third party packages.
const express = require('express')

// Project packages.
const packageJson = require('../package.json')
const { utils } = require('@bldr/core')

let config = utils.bootstrapConfig()

/**
 * Directory where to store the json state objects.
 */
const store = config.seatingPlan.store

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

function registerRestApi () {
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

  app.get('/', (req, res) => {
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

  app.get('/latest', (req, res) => {
    const latestPath = path.join(store, 'latest')
    if (fs.existsSync(latestPath)) {
      const latest = fs.readFileSync(latestPath, { encoding: 'utf-8' })
      const state = getStateByTimeStampMsec(Number(latest))
      res.status(200).send(state)
    } else {
      res.sendStatus(404)
    }
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
    if (fs.existsSync(storePath)) {
      fs.unlinkSync(storePath)
      res.status(200).send({ timeStampMsec: timeStampMsec })
    } else {
      res.sendStatus(404)
    }
  })

  return app
}

module.exports = {
  registerRestApi
}
