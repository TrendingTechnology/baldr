// Node packages.
const childProcess = require('child_process')
const path = require('path')

// Third party packages.
const chalk = require('chalk')

// Project packages.
const mediaServer = require('@bldr/media-server')
const lib = require('../../lib.js')

function createVideoPreviewImageOneFile (filePath, second) {
  if (!second) second = 10
  const assetType = lib.filePathToAssetType(filePath)
  if (assetType === 'video') {
    const output = `${filePath}_preview.jpg`
    const outputFileName = path.basename(output)
    console.log(`Preview image: ${chalk.green(outputFileName)} at second ${chalk.green(second)})`)
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

function action (files, cmdObj) {
  mediaServer.walk({
    asset (relPath) {
      createVideoPreviewImageOneFile(relPath, cmdObj.seconds)
    }
  }, {
    path: files
  })
}

module.exports = action
