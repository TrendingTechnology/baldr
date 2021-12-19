// Third party packages.
import express from 'express'

import { validateMediaType } from '../utils'
import openParentFolder from '../operations/open-parent-folder'
import openEditor from '../operations/open-editor'
import updateMedia from '../operations/update-media'
import { database, helpMessages, extractString } from '../api'

/**
 * Register the express js rest api in a giant function.
 */
export default function (): express.Express {
  const app = express()

  app.get('/', (req, res) => {
    res.json(helpMessages.navigation)
  })

  /* get */

  app.get('/get/presentation/by-ref', async (req, res, next) => {
    try {
      if (req.query.ref == null) {
        throw new Error('You have to specify an reference (?ref=myfile).')
      }

      const ref = req.query.ref

      if (typeof ref !== 'string') {
        throw new Error('“ref” has to be a string.')
      }

      res.json(await database.getPresentationByRef(ref))
    } catch (error) {
      next(error)
    }
  })

  app.get('/get/presentations/by-substring', async (req, res, next) => {
    try {
      if (req.query.search == null) {
        throw new Error('You have to specify an parameter named search')
      }

      const search = req.query.search

      if (typeof search !== 'string') {
        throw new Error('“search” has to be a string.')
      }

      res.json(await database.searchPresentationBySubstring(search))
    } catch (error) {
      next(error)
    }
  })

  app.get('/get/asset', async (req, res, next) => {
    try {
      let scheme: 'ref' | 'uuid'
      let uri
      if (req.query.ref == null && req.query.uuid != null) {
        scheme = 'uuid'
        uri = req.query.uuid
      } else if (req.query.uuid == null && req.query.ref != null) {
        scheme = 'ref'
        uri = req.query.ref
      } else {
        throw new Error('Use as query ref or uuid')
      }

      if (typeof uri !== 'string') {
        throw new Error('The value of the query has to be a string.')
      }

      res.json(await database.getAsset(scheme, uri))
    } catch (error) {
      next(error)
    }
  })

  app.get('/get/folder-title-tree', async (req, res, next) => {
    try {
      res.json(await database.getFolderTitleTree())
    } catch (error) {
      next(error)
    }
  })

  app.get('/get/all-asset-refs', async (req, res, next) => {
    try {
      res.json({})
    } catch (error) {
      next(error)
    }
  })

  app.get('/get/all-asset-uuids', async (req, res, next) => {
    try {
      res.json({})
    } catch (error) {
      next(error)
    }
  })

  /* mgmt = management */

  app.get('/mgmt/flush', async (req, res, next) => {
    try {
      res.json(await database.flushMediaFiles())
    } catch (error) {
      next(error)
    }
  })

  app.get('/mgmt/init', async (req, res, next) => {
    try {
      res.json(await database.initialize())
    } catch (error) {
      next(error)
    }
  })

  app.get('/mgmt/open', async (req, res, next) => {
    try {
      const query = req.query
      if (query.ref == null) {
        throw new Error('You have to specify an reference (?ref=myfile).')
      }
      if (query.with == null) {
        query.with = 'editor'
      }
      if (query.type == null) {
        query.type = 'presentations'
      }
      const archive = 'archive' in query
      const create = 'create' in query

      const ref = extractString(query, 'ref')
      const type = validateMediaType(extractString(query, 'type'))
      if (query.with === 'editor') {
        res.json(await openEditor(ref, type))
      } else if (query.with === 'folder') {
        res.json(await openParentFolder(ref, type, archive, create))
      }
    } catch (error) {
      next(error)
    }
  })

  app.get('/mgmt/re-init', async (req, res, next) => {
    try {
      res.json(await database.reInitialize())
    } catch (error) {
      next(error)
    }
  })

  app.get('/mgmt/update', async (req, res, next) => {
    try {
      res.json(await updateMedia(false))
    } catch (error) {
      next(error)
    }
  })

  /* stats = statistics */

  app.get('/stats/count', async (req, res, next) => {
    try {
      res.json(await database.getDocumentCounts())
    } catch (error) {
      next(error)
    }
  })

  app.get('/stats/updates', async (req, res, next) => {
    try {
      res.json(await database.listUpdateTasks())
    } catch (error) {
      next(error)
    }
  })

  return app
}
