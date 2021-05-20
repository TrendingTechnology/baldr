// Node packages.
import path from 'path'

// Project packages.
import fs from 'fs'

import * as log from '@bldr/log'
import { readYamlFile } from '@bldr/file-reader-writer'
import { fetchFile } from '@bldr/core-node'
import { CommandRunner } from '@bldr/cli-utils'
import { filePathToMimeType, walk } from '@bldr/media-manager'

interface CmdObj {
  second: number
  force: boolean
}

const cmd = new CommandRunner({ verbose: true })

/**
 * @param srcPath - The media asset file path.
 */
async function createAudioPreview (srcPath: string, destPath: string): Promise<void> {
  const yamlFile = `${srcPath}.yml`
  const metaData = readYamlFile(yamlFile)

  if (metaData.coverSource != null) {
    await fetchFile(metaData.coverSource, destPath)
    log.info('Create preview image %s of an audio file.', destPath)
  } else {
    log.error('No property “cover_source” found.')
  }
}

/**
 * Create a video preview image.
 */
function createVideoPreview (srcPath: string, destPath: string, second: number = 10): void {
  let secondString: string
  if (typeof second === 'number') {
    secondString = second.toString()
  } else {
    secondString = second
  }
  cmd.execSync(['ffmpeg',
    '-i', srcPath,
    '-ss', secondString, // Position in seconds
    '-vframes', '1', // only handle one video frame
    '-qscale:v', '10', // Effective range for JPEG is 2-31 with 31 being the worst quality.
    '-y', // Overwrite output files without asking
    destPath
  ])
  log.info('Create preview image %s of a video file.', destPath)
}

function createPdfPreview (srcPath: string, destPath: string): void {
  destPath = destPath.replace('.jpg', '')
  cmd.execSync([
    'pdftocairo',
    '-jpeg', '-jpegopt', 'quality=30,optimize=y',
    '-singlefile',
    '-scale-to', '500',
    srcPath, destPath
  ])
  log.info('Create preview image %s of a PDF file.', destPath)
}

async function createPreviewOneFile (srcPath: string, cmdObj: CmdObj): Promise<void> {
  const mimeType = filePathToMimeType(srcPath)
  const destPath = `${srcPath}_preview.jpg`

  if (fs.existsSync(destPath) && !cmdObj.force) {
    return
  }

  if (mimeType === 'video') {
    createVideoPreview(srcPath, destPath, cmdObj.second)
  } else if (mimeType === 'document') {
    createPdfPreview(srcPath, destPath)
  } else if (mimeType === 'audio') {
    await createAudioPreview(srcPath, destPath)
  }
}

/**
 * Create preview images.
 *
 * @param filePaths - An array of input files. This parameter comes from
 *   the commanders’ variadic parameter `[files...]`.
 * @param cmdObj - An object containing options as key-value pairs.
 *  This parameter comes from `commander.Command.opts()`
 */
async function action (filePaths: string[], cmdObj: CmdObj): Promise<void> {
  await walk({
    asset (relPath) {
      createPreviewOneFile(relPath, cmdObj)
    }
  }, {
    path: filePaths
  })
}

export = action
