// Node packages.
import childProcess from 'child_process'
import path from 'path'

// Third party packages.
import chalk from 'chalk'

// Project packages.
import { filePathToAssetType, walk } from '@bldr/media-manager'

/**
 * Create a video preview image.
 *
 * @param filePath
 * @param second
 */
function createVideoPreviewImageOneFile (filePath: string, second: number | string) {
  if (!second)
    second = 10
  const assetType = filePathToAssetType(filePath)
  if (assetType === 'video') {
    const output = `${filePath}_preview.jpg`
    const outputFileName = path.basename(output)
    console.log(`Preview image: ${chalk.green(outputFileName)} at second ${chalk.green(second)})`)
    if (typeof second === 'number')
      second = second.toString()
    const process = childProcess.spawnSync('ffmpeg', [
      '-i', filePath,
      '-ss', second, // Position in seconds
      '-vframes', '1', // only handle one video frame
      '-qscale:v', '10', // Effective range for JPEG is 2-31 with 31 being the worst quality.
      '-y', // Overwrite output files without asking
      output
    ])
    if (process.status !== 0) {
      throw new Error()
    }
  }
}

/**
 * Create video preview images.
 *
 * @param filePaths - An array of input files. This parameter comes from
 *   the commanders’ variadic parameter `[files...]`.
 * @param cmdObj - An object containing options as key-value pairs.
 *  This parameter comes from `commander.Command.opts()`
 */
function action (filePaths: string[], cmdObj: { [key: string]: any }) {
  walk({
    asset (relPath) {
      createVideoPreviewImageOneFile(relPath, cmdObj.seconds)
    }
  }, {
    path: filePaths
  })
}

export = action
