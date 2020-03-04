// Node packages.
const childProcess = require('child_process')
const path = require('path')

// Third party packages.
const chalk = require('chalk')

// Project packages.
const mediaServer = require('@bldr/api-media-server')
const lib = require('../lib.js')

function createVideoPreviewImageOneFile (filePath, second) {
  const assetType = lib.filePathToAssetType(filePath)
  if (assetType === 'video') {
    const output = `${filePath}_preview.jpg`
    const outputFileName = path.basename(output)
    console.log(`Preview image: ${chalk.green(outputFileName)} at second ${chalk.green(second)})`)
    childProcess.spawnSync('ffmpeg', [
      '-i', filePath,
      '-ss', second, // Position in seconds
      '-vframes', '1', // only handle one video frame
      '-qscale:v', '10', // Effective range for JPEG is 2-31 with 31 being the worst quality.
      '-y', // Overwrite output files without asking
      output
    ])
  }
}

function action (filePath, second = 10) {
  if (filePath) {
    createVideoPreviewImageOneFile(filePath, second)
  } else {
    mediaServer.walk(process.cwd(), {
      asset (relPath) {
        createVideoPreviewImageOneFile(relPath, second)
      }
    })
  }
}

module.exports = {
  command: 'video-preview [input] [second]',
  alias: 'v',
  description: 'Create video preview images',
  action
}
