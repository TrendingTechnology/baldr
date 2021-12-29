import express from 'express'

import { validateMediaType } from '../utils'
import openFileManager from '../operations/open-file-manager'
import openEditor from '../operations/open-editor'
import updateMedia from '../operations/update-media'
import { database } from '../api'
import * as query from '../query'

export type MediaType = 'asset' | 'presentation'

export default function (): express.Express {
  const app = express()

  // Update the media server
  app.put('/', async (request, response, next) => {
    try {
      response.json(await updateMedia(false))
    } catch (error) {
      next(error)
    }
  })

  // Statistics
  app.get('/', async (request, response, next) => {
    try {
      const result = {
        count: await database.getDocumentCounts(),
        updateTasks: await database.listUpdateTasks()
      }
      response.json(result)
    } catch (error) {
      next(error)
    }
  })

  // flush
  app.delete('/', async (request, response, next) => {
    try {
      response.json(await database.flushMediaFiles())
    } catch (error) {
      next(error)
    }
  })

  app.get('/get/presentation/by-ref', async (request, response, next) => {
    try {
      const ref = query.extractString(request.query, 'ref')
      response.json(await database.getPresentationByRef(ref))
    } catch (error) {
      next(error)
    }
  })

  app.get(
    '/get/presentations/by-substring',
    async (request, response, next) => {
      try {
        const search = query.extractString(request.query, 'search')
        response.json(await database.searchPresentationBySubstring(search))
      } catch (error) {
        next(error)
      }
    }
  )

  app.get('/get/asset', async (request, response, next) => {
    try {
      let scheme: 'ref' | 'uuid'
      let uri
      if (request.query.ref == null && request.query.uuid != null) {
        scheme = 'uuid'
        uri = request.query.uuid
      } else if (request.query.uuid == null && request.query.ref != null) {
        scheme = 'ref'
        uri = request.query.ref
      } else {
        throw new Error('Use as query ref or uuid')
      }

      if (typeof uri !== 'string') {
        throw new Error('The value of the query has to be a string.')
      }

      response.json(await database.getAsset(scheme, uri))
    } catch (error) {
      next(error)
    }
  })

  app.get('/titles', async (request, response, next) => {
    try {
      response.json(await database.getFolderTitleTree())
    } catch (error) {
      next(error)
    }
  })

  app.get('/get/all-asset-refs', async (request, response, next) => {
    try {
      response.json({})
    } catch (error) {
      next(error)
    }
  })

  app.get('/get/all-asset-uuids', async (request, response, next) => {
    try {
      response.json({})
    } catch (error) {
      next(error)
    }
  })

  app.get('/open/editor', async (request, response, next) => {
    try {
      const ref = query.extractString(request.query, 'ref')
      const type = validateMediaType(
        query.extractString(request.query, 'type', 'presentation')
      )
      const dryRun = query.extractBoolean(request.query, 'dry-run', false)
      response.json(await openEditor(ref, type, dryRun))
    } catch (error) {
      next(error)
    }
  })

  app.get('/open/file-manager', async (request, response, next) => {
    try {
      const ref = query.extractString(request.query, 'ref')
      const type = validateMediaType(query.extractString(request.query, 'type'))
      const create = query.extractBoolean(request.query, 'create', false)
      const archive = query.extractBoolean(request.query, 'archive', false)
      const dryRun = query.extractBoolean(request.query, 'dry-run', false)
      response.json(await openFileManager(ref, type, archive, create, dryRun))
    } catch (error) {
      next(error)
    }
  })

  return app
}
