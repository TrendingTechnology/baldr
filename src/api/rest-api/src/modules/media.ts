import express from 'express'

import { validateMediaType } from '../utils'
import openFileManager from '../operations/open-file-manager'
import openEditor from '../operations/open-editor'
import updateMedia from '../operations/update-media'
import { database } from '../api'
import * as query from '../query'

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

  app.get(
    '/presentations/by-:scheme/:authority',
    async (request, response, next) => {
      try {
        if (
          request.params.scheme !== 'ref' &&
          request.params.scheme !== 'uuid'
        ) {
          throw new Error('Scheme has to be “ref” or “uuid”')
        }
        response.json(
          await database.getPresentation(
            request.params.scheme,
            request.params.authority
          )
        )
      } catch (error) {
        next(error)
      }
    }
  )

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

  app.get('/assets/by-:scheme/:authority', async (request, response, next) => {
    try {
      if (request.params.scheme !== 'ref' && request.params.scheme !== 'uuid') {
        throw new Error('Scheme has to be “ref” or “uuid”')
      }
      response.json(
        await database.getAsset(request.params.scheme, request.params.authority)
      )
    } catch (error) {
      next(error)
    }
  })

  app.get('/assets/refs', async (request, response, next) => {
    try {
      response.json(await database.getAllAssetRefs())
    } catch (error) {
      next(error)
    }
  })

  app.get('/assets/uuids', async (request, response, next) => {
    try {
      response.json(await database.getAllAssetUuids())
    } catch (error) {
      next(error)
    }
  })

  app.get('/assets/uris', async (request, response, next) => {
    try {
      response.json(await database.getAllAssetUris())
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
