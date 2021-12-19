// Third party packages.
import express from 'express'

import { validateMediaType } from '../utils'
import openParentFolder from '../operations/open-parent-folder'
import openEditor from '../operations/open-editor'
import updateMedia from '../operations/update-media'
import { database } from '../api'
import * as query from '../query'

/**
 * Register the express js rest api in a giant function.
 */
export default function (): express.Express {
  const app = express()

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

  app.get('/get/folder-title-tree', async (request, response, next) => {
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

  /* mgmt = management */

  app.get('/mgmt/flush', async (request, response, next) => {
    try {
      response.json(await database.flushMediaFiles())
    } catch (error) {
      next(error)
    }
  })

  app.get('/mgmt/init', async (request, response, next) => {
    try {
      response.json(await database.initialize())
    } catch (error) {
      next(error)
    }
  })

  app.get('/mgmt/open', async (request, response, next) => {
    try {

      if (request.query.with == null) {
        request.query.with = 'editor'
      }
      if (request.query.type == null) {
        request.query.type = 'presentations'
      }
      const archive = 'archive' in query
      const create = 'create' in query

      const ref = query.extractString(request.query, 'ref')
      const type = validateMediaType(
        query.extractString(request.query, 'type')
      )
      if (request.query.with === 'editor') {
        response.json(await openEditor(ref, type))
      } else if (request.query.with === 'folder') {
        response.json(await openParentFolder(ref, type, archive, create))
      }
    } catch (error) {
      next(error)
    }
  })

  app.get('/open/editor', async (request, response, next) => {
    try {
      const ref = query.extractString(request.query, 'ref')
      const type = validateMediaType(
        query.extractString(request.query, 'type', 'presentations')
      )
      const dryRun = query.extractBoolean(request.query, 'dry-run', false)
      response.json(await openEditor(ref, type, dryRun))
    } catch (error) {
      next(error)
    }
  })

  app.get('/mgmt/re-init', async (request, response, next) => {
    try {
      response.json(await database.reInitialize())
    } catch (error) {
      next(error)
    }
  })

  app.get('/mgmt/update', async (request, response, next) => {
    try {
      response.json(await updateMedia(false))
    } catch (error) {
      next(error)
    }
  })

  /* stats = statistics */

  app.get('/stats/count', async (request, response, next) => {
    try {
      response.json(await database.getDocumentCounts())
    } catch (error) {
      next(error)
    }
  })

  app.get('/stats/updates', async (request, response, next) => {
    try {
      response.json(await database.listUpdateTasks())
    } catch (error) {
      next(error)
    }
  })

  return app
}
