import express from 'express'

import { database } from '../api'

export default function (): express.Express {
  const app = express()

  // Re-initialize
  app.post('/', async (request, response, next) => {
    try {
      response.json(await database.reInitialize())
    } catch (error) {
      next(error)
    }
  })

  return app
}
