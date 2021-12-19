import path from 'path'
import childProcess from 'child_process'
import fs from 'fs'

import { walk } from '@bldr/media-manager'
import { writeJsonFile } from '@bldr/file-reader-writer'
import { TreeFactory } from '@bldr/titles'
import { GenericError, ApiTypes } from '@bldr/type-definitions'
import { getConfig } from '@bldr/config'
import {
  buildPresentationData,
  buildDbAssetData
} from '@bldr/media-data-collector'

import { database } from '../api'

const config = getConfig()

type ServerMediaType = 'presentations' | 'assets'

class ErrorMessageCollector {
  /**
   * A container array for all error messages send out via the REST API.
   */
  public messages: string[] = []

  public addError (filePath: string, error: GenericError | unknown): void {
    const e = error as GenericError
    console.log(error)
    let relPath = filePath.replace(config.mediaServer.basePath, '')
    relPath = relPath.replace(/^\//, '')
    // eslint-disable-next-line
    const msg = `${relPath}: [${e.name}] ${e.message}`
    console.log(msg)
    this.messages.push(msg)
  }
}

async function insertMediaFileIntoDb (
  filePath: string,
  mediaType: ServerMediaType,
  errors: ErrorMessageCollector
): Promise<void> {
  let media
  try {
    if (mediaType === 'presentations') {
      media = buildPresentationData(filePath)
    } else if (mediaType === 'assets') {
      // Now only with meta data yml. Fix problems with PDF lying around.
      if (!fs.existsSync(`${filePath}.yml`)) {
        return
      }
      media = buildDbAssetData(filePath)
    }
    if (media == null) {
      return
    }
    await database.db.collection(mediaType).insertOne(media)
  } catch (error) {
    errors.addError(filePath, error)
  }
}

/**
 * Run git pull on the `basePath`
 */
function gitPull (): void {
  const gitPull = childProcess.spawnSync('git', ['pull'], {
    cwd: config.mediaServer.basePath,
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
export default async function (
  full: boolean = false
): Promise<ApiTypes.UpdateResult> {
  const errors = new ErrorMessageCollector()

  const titleTreeFactory = new TreeFactory()
  if (full) {
    gitPull()
  }
  const gitRevParse = childProcess.spawnSync('git', ['rev-parse', 'HEAD'], {
    cwd: config.mediaServer.basePath,
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
        await insertMediaFileIntoDb(filePath, 'presentations', errors)
        titleTreeFactory.addTitleByPath(filePath)
        presentationCounter++
      },
      asset: async filePath => {
        await insertMediaFileIntoDb(filePath, 'assets', errors)
        assetCounter++
      }
    },
    {
      path: config.mediaServer.basePath
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
    errors: errors.messages,
    count: {
      assets: assetCounter,
      presentations: presentationCounter
    }
  }
}
