import express from 'express'

import { database } from '../api'

export default function (): express.Express {
  const app = express()

  // initialize
  app.post('/', async (request, response, next) => {
    try {
      response.json(await database.initialize())
    } catch (error) {
      next(error)
    }
  })

  return app
}
