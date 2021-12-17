#! /usr/bin/env node

/**
 * The REST API and command line interface of the BALDR media server.
 *
 * # Media types:
 *
 * - presentation (`Presentation()`)
 * - asset (`Asset()`)
 *   - multipart asset (`filename.jpg`, `filename_no002.jpg`, `filename_no003.jpg`)
 *
 * # Definition of the objects:
 *
 * A _presentation_ is a YAML file for the BALDR presentation app. It must have
 * the file name scheme `*.baldr.yml`. The media server stores the whole YAML
 * file in the MongoDB database.
 *
 * A _asset_ is a media file which has a meta data file in the YAML format.
 * The file name scheme for this meta data file is `media-file.jpg.yml`. The
 * suffix `.yml` has to be appended. Only the content of the meta data file
 * is stored into the database.
 *
 * # REST API
 * - `get`
 *   - `folder-title-tree`: Get the folder title tree as a hierarchical json
 *     object.
 * - `mgmt`
 *   - `flush`: Delete all media files (assets, presentations) from the database.
 *   - `init`: Initialize the MongoDB database
 *   - `open`: Open a media file specified by an ID. This query parameters are
 *     available:
 *       - `ref`: The ID of the media file (required).
 *       - `type`: `presentations`, `assets`. The default value is
 *         `presentations.`
 *       - `with`: `editor` specified in `config.mediaServer.editor`
 *         (`/etc/baldr.json`) or `folder` to open the parent folder of the
 *         given media file. The default value is `editor`
 *       - `archive`: True if present, false by default. Open the file or the
           folder in the corresponding archive folder structure.
 *       - `create`: True if present, false by default. Create the possibly none
            existing directory structure in a recursive manner.
 *   - `re-init`: Re-Initialize the MongoDB database (Drop all collections and
 *     initialize)
 *   - `update`: Update the media server database (Flush and insert).
 *   - `query`: Getting results by using query parameters. This query parameters
 *     are available:
 *      - `type`: `assets` (default), `presentations` (what)
 *      - `method`: `exactMatch`, `substringSearch` (default) (how).
 *          - `exactMatch`: The query parameter `search` must be a perfect match
 *            to a top level database field to get a result.
 *          - `substringSearch`: The query parameter `search` is only a
 *            substring of the string to search in.
 *      - `field`: `ref` (default), `title`, etc ... (where).
 *      - `search`: Some text to search for (search for).
 *      - `result`: `fullObjects` (default), `dynamicSelect`
 * - `stats`:
 *   - `count`: Count / sum of the media files (assets, presentations) in the
 *     database.
 *   - `updates`: Journal of the update processes with timestamps.
 *
 * @module @bldr/media-server
 */

// Node packages.
import childProcess from 'child_process'
import fs from 'fs'
import path from 'path'

// Third party packages.
import cors from 'cors'
import express from 'express'

// Project packages.
import { getConfig } from '@bldr/config'
import { walk } from '@bldr/media-manager'
import { writeJsonFile } from '@bldr/file-reader-writer'
import { TreeFactory } from '@bldr/titles'
import {
  StringIndexedObject,
  GenericError,
  ApiTypes
} from '@bldr/type-definitions'

import {
  buildDbPresentationData,
  buildDbAssetData
} from '@bldr/media-data-collector'

import {
  MediaType,
  openParentFolder,
  openEditor,
  validateMediaType
} from './operations'
import { connectDb, Database } from '@bldr/mongodb-connector'

// Submodules.
import { registerSeatingPlan } from './seating-plan'

export { openArchivesInFileManager } from './operations'

const config = getConfig()

/**
 * Base path of the media server file store.
 */
const basePath = config.mediaServer.basePath

/**
 * A container array for all error messages send out via the REST API.
 */
let errors: string[] = []

export let database: Database

/* Media objects **************************************************************/

let titleTreeFactory: TreeFactory

/* Insert *********************************************************************/

type ServerMediaType = 'presentations' | 'assets'

async function insertMediaFileIntoDb (
  filePath: string,
  mediaType: ServerMediaType
): Promise<void> {
  let object
  try {
    if (mediaType === 'presentations') {
      object = buildDbPresentationData(filePath)
    } else if (mediaType === 'assets') {
      // Now only with meta data yml. Fix problems with PDF lying around.
      if (!fs.existsSync(`${filePath}.yml`)) {
        return
      }
      object = buildDbAssetData(filePath)
    }
    if (object == null) {
      return
    }
    await database.db.collection(mediaType).insertOne(object)
  } catch (e) {
    const error = e as GenericError
    console.log(error)
    let relPath = filePath.replace(config.mediaServer.basePath, '')
    relPath = relPath.replace(/^\//, '')
    // eslint-disable-next-line
    const msg = `${relPath}: [${error.name}] ${error.message}`
    console.log(msg)
    errors.push(msg)
  }
}

/**
 * Run git pull on the `basePath`
 */
function gitPull (): void {
  const gitPull = childProcess.spawnSync('git', ['pull'], {
    cwd: basePath,
    encoding: 'utf-8'
  })
  if (gitPull.status !== 0) {
    throw new Error('git pull exits with an non-zero status code.')
  }
}

/**
 * Update the media server.
 *
 * @param full - Update with git pull.
 *
 * @returns {Promise.<Object>}
 */
async function update (full: boolean = false): Promise<ApiTypes.UpdateResult> {
  // To get a fresh title tree, otherwise changes of the titles are not updated
  titleTreeFactory = new TreeFactory()
  if (full) {
    gitPull()
  }
  const gitRevParse = childProcess.spawnSync('git', ['rev-parse', 'HEAD'], {
    cwd: basePath,
    encoding: 'utf-8'
  })
  let assetCounter = 0
  let presentationCounter = 0
  const lastCommitId = gitRevParse.stdout.replace(/\n$/, '')
  await database.connect()
  await database.initialize()
  await database.flushMediaFiles()
  const begin = new Date().getTime()
  await database.db.collection('updates').insertOne({ begin: begin, end: 0 })
  await walk(
    {
      everyFile: filePath => {
        // Delete temporary files.
        if (
          filePath.match(/\.(aux|out|log|synctex\.gz|mscx,)$/) != null ||
          filePath.includes('Praesentation_tmp.baldr.yml') ||
          filePath.includes('title_tmp.txt')
        ) {
          fs.unlinkSync(filePath)
        }
      },
      directory: filePath => {
        // Delete empty directories.
        if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
          const files = fs.readdirSync(filePath)
          if (files.length === 0) {
            fs.rmdirSync(filePath)
          }
        }
      },
      presentation: async filePath => {
        await insertMediaFileIntoDb(filePath, 'presentations')
        presentationCounter++
      },
      asset: async filePath => {
        await insertMediaFileIntoDb(filePath, 'assets')
        assetCounter++
      }
    },
    {
      path: basePath
    }
  )

  // .replaceOne and upsert: Problems with merged objects?
  await database.db.collection('folderTitleTree').deleteOne({ ref: 'root' })
  const tree = titleTreeFactory.getTree()
  await database.db.collection('folderTitleTree').insertOne({
    ref: 'root', // To avoid duplicate trees.
    tree
  })
  writeJsonFile(path.join(config.mediaServer.basePath, 'title-tree.json'), tree)
  const end = new Date().getTime()
  await database.db
    .collection('updates')
    .updateOne({ begin: begin }, { $set: { end: end, lastCommitId } })
  return {
    finished: true,
    begin,
    end,
    duration: end - begin,
    lastCommitId,
    errors,
    count: {
      assets: assetCounter,
      presentations: presentationCounter
    }
  }
}

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
  const db = database.db
  // https://stackoverflow.com/a/38427476/10193818
  function escapeRegex (text: string): string {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
  }

  const app = express()

  app.get('/', (req, res) => {
    res.json(helpMessages.navigation)
  })

  /* query */

  app.get('/query', async (req, res, next) => {
    try {
      const query = req.query
      if (Object.keys(query).length === 0) {
        res.status(500).send({
          error: {
            msg: 'Missing query parameters!',
            navigationGuide: helpMessages.navigation.query
          }
        })
        return
      }

      // type
      let type: MediaType
      if (query.type != null && typeof query.type === 'string') {
        type = validateMediaType(query.type)
      } else {
        type = 'assets'
      }

      // method
      const methods = ['exactMatch', 'substringSearch']
      const method = extractString(query, 'method', 'substringSearch')

      if (!methods.includes(method)) {
        throw new Error(
          `Unkown method “${method}”! Allowed methods: ${methods.join(', ')}`
        )
      }

      // field
      const field = extractString(query, 'field', 'ref')
      // result
      if (!('result' in query)) query.result = 'fullObjects'

      // await database.connect()
      const collection = db.collection(type)

      // find
      let result
      let find
      // exactMatch
      if (query.method === 'exactMatch') {
        const findObject: StringIndexedObject = {}
        findObject[field] = query.search
        find = collection.find(findObject, { projection: { _id: 0 } })
        result = await find.next()
        // substringSearch
      } else if (query.method === 'substringSearch') {
        // https://stackoverflow.com/a/38427476/10193818
        let search: string = ''
        if (query.search != null && typeof query.search === 'string') {
          search = query.search
        }
        const regex = new RegExp(escapeRegex(search), 'gi')
        const $match: StringIndexedObject = {}
        $match[field] = regex
        let $project
        if (query.result === 'fullObjects') {
          $project = {
            _id: false
          }
        } else if (query.result === 'dynamicSelect') {
          $project = {
            _id: false,
            ref: true,
            name: `$${field}`
          }
        }
        find = collection.aggregate([{ $match }, { $project }])
        result = await find.toArray()
      }
      res.json(result)
    } catch (error) {
      next(error)
    }
  })

  /* get */

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
        throw new Error('You have to specify an ID (?ref=myfile).')
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
      res.json(await update(false))
      // Clear error message store.
      errors = []
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
async function runRestApi (port?: number): Promise<express.Express> {
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

const main = async function (): Promise<express.Express> {
  let port
  if (process.argv.length === 3) port = parseInt(process.argv[2])
  return await runRestApi(port)
}

if (require.main === module) {
  main()
    .then()
    .catch(reason => console.log(reason))
}
