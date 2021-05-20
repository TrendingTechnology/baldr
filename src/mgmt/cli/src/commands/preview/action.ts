// Node packages.
import path from 'path'

// Project packages.
import { filePathToMimeType, walk } from '@bldr/media-manager'
import * as log from '@bldr/log'
import { CommandRunner } from '@bldr/cli-utils'

interface CmdObj {
  second: number
}

const cmd = new CommandRunner({ verbose: true })

/**
 * Create a video preview image.
 */
async function createVideoPreview (srcPath: string, destPath: string, second: number = 10): Promise<void> {
  let secondString: string
  if (typeof second === 'number') {
    secondString = second.toString()
  } else {
    secondString = second
  }
  await cmd.exec(['ffmpeg',
    '-i', srcPath,
    '-ss', secondString, // Position in seconds
    '-vframes', '1', // only handle one video frame
    '-qscale:v', '10', // Effective range for JPEG is 2-31 with 31 being the worst quality.
    '-y', // Overwrite output files without asking
    destPath
  ])
}

async function createPdfPreview (srcPath: string, destPath: string): Promise<void> {
  cmd.exec(['magick',
    'convert', `${srcPath}[0]`, destPath
  ])
}

async function createPreviewOneFile (srcPath: string, cmdObj: CmdObj): Promise<void> {
  const mimeType = filePathToMimeType(srcPath)
  const destPath = `${srcPath}_preview.jpg`
  const destFileName = path.basename(destPath)
  log.info('Create preview image %s of %s file.', destFileName, mimeType)
  if (mimeType === 'video') {
    await createVideoPreview(srcPath, destPath, cmdObj.second)
  } else if (mimeType === 'document') {
    await createPdfPreview(srcPath, destPath)
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
