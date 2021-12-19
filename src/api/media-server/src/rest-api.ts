// Third party packages.
import cors from 'cors'
import express from 'express'

// Project packages.
import { getConfig } from '@bldr/config'
import { StringIndexedObject } from '@bldr/type-definitions'
import { connectDb, Database } from '@bldr/mongodb-connector'

import { validateMediaType } from './utils'

import openParentFolder from './operations/open-parent-folder'
import openEditor from './operations/open-editor'

import updateMedia from './operations/update-media'

// Submodules.
import { registerSeatingPlan } from './seating-plan'

const config = getConfig()

export let database: Database

/* Express Rest API ***********************************************************/

/**
 * This object hold jsons for displaying help messages in the browser on
 * some entry point urls.
 *
 * Update docs on the top of this file in the JSDoc block.
 */
const helpMessages: StringIndexedObject = {
  navigation: {
    get: {
      'folder-title-tree':
        'Get the folder title tree as a hierarchical json object.'
    },
    mgmt: {
      flush:
        'Delete all media files (assets, presentations) from the database.',
      init: 'Initialize the MongoDB database.',
      open: {
        '#description': 'Open a media file specified by an ID.',
        '#examples': [
          '/media/mgmt/open?id=Egmont',
          '/media/mgmt/open?with=editor&id=Egmont',
          '/media/mgmt/open?with=editor&type=presentations&id=Egmont',
          '/media/mgmt/open?with=folder&type=presentations&id=Egmont&archive=true',
          '/media/mgmt/open?with=folder&type=presentations&id=Egmont&archive=true&create=true',
          '/media/mgmt/open?with=editor&type=assets&id=Beethoven_Ludwig-van',
          '/media/mgmt/open?with=folder&type=assets&id=Beethoven_Ludwig-van'
        ],
        '#parameters': {
          ref: 'The ID of the media file (required).',
          type:
            '`presentations`, `assets`. The default value is `presentations.`',
          with:
            '`editor` specified in `config.mediaServer.editor` (`/etc/baldr.json`) or `folder` to open the parent folder of the given media file. The default value is `editor`.',
          archive:
            'True if present, false by default. Open the file or the folder in the corresponding archive folder structure.',
          create:
            'True if present, false by default. Create the possibly non existing directory structure in a recursive manner.'
        }
      },
      're-init':
        'Re-Initialize the MongoDB database (Drop all collections and initialize).',
      update: 'Update the media server database (Flush and insert).'
    },
    query: {
      '#description': 'Get results by using query parameters',
      '#examples': [
        '/media/query?type=assets&field=ref&method=exactMatch&search=Egmont-Ouverture',
        '/media/query?type=assets&field=uuid&method=exactMatch&search=c64047d2-983d-4009-a35f-02c95534cb53',
        '/media/query?type=presentations&field=ref&method=exactMatch&search=Beethoven_Marmotte',
        '/media/query?type=assets&field=path&method=substringSearch&search=35_Bilder-Ausstellung_Ueberblick&result=fullObjects',
        '/media/query?type=assets&field=path&method=substringSearch&search=35_Bilder-Ausstellung_Ueberblick&result=dynamicSelect'
      ],
      '#parameters': {
        type: '`assets` (default), `presentations` (what)',
        method:
          '`exactMatch`, `substringSearch` (default) (how). `exactMatch`: The query parameter `search` must be a perfect match to a top level database field to get a result. `substringSearch`: The query parameter `search` is only a substring of the string to search in.',
        field: '`ref` (default), `title`, etc ... (where).',
        search: 'Some text to search for (search for).',
        result: '`fullObjects` (default), `dynamicSelect`'
      }
    },
    stats: {
      count:
        'Count / sum of the media files (assets, presentations) in the database.',
      updates: 'Journal of the update processes with timestamps.'
    }
  }
}

function extractString (
  query: any,
  propertyName: string,
  defaultValue: string | null = null
): string {
  if (
    query == null ||
    typeof query !== 'object' ||
    query[propertyName] == null ||
    typeof query[propertyName] !== 'string'
  ) {
    if (defaultValue != null) {
      return defaultValue
    } else {
      throw new Error(
        `No value for property ${propertyName} in the query object.`
      )
    }
  }
  return query[propertyName]
}

/**
 * Register the express js rest api in a giant function.
 */
function registerMediaRestApi (): express.Express {
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

/**
 * Run the REST API. Listen to a TCP port.
 *
 * @param port - A TCP port.
 */
export async function startRestApi (port?: number): Promise<express.Express> {
  const app = express()

  const mongoClient = await connectDb()
  database = new Database(mongoClient.db())
  await database.initialize()

  app.use(cors())
  app.use(express.json())

  app.use('/seating-plan', registerSeatingPlan(database))
  app.use('/media', registerMediaRestApi())

  const helpMessages: StringIndexedObject = {}

  app.get('/', (req, res) => {
    res.json({
      navigation: {
        media: helpMessages.navigation
      }
    })
  })

  let usedPort: number
  if (port == null) {
    usedPort = config.api.port
  } else {
    usedPort = port
  }
  app.listen(usedPort, () => {
    console.log(`The BALDR REST API is running on port ${usedPort}.`)
  })
  return app
}
