// Node packages.
const fs = require('fs')

// Project packages.
const { CommandRunner } = require('@bldr/cli-utils')
const { createYamlOneFile } = require('../yaml/action.js')

/**
 *
 */
async function action (youtubeId) {
  const cmd = new CommandRunner()
  cmd.startSpin()
  cmd.log('Updating youtube-dl using pip3.')
  await cmd.exec('pip3', 'install', '--upgrade', 'youtube-dl')

  cmd.log('Downloading the YouTube video.')
  await cmd.exec(
    'youtube-dl',
    '--format', 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/mp4',
    '--output', youtubeId,
    '--write-thumbnail',
    youtubeId
  )

  cmd.log('Creating the metadata file in the YAML format.')
  await createYamlOneFile(`${youtubeId}.mp4`, { youtube_id: youtubeId })

  if (fs.existsSync(`${youtubeId}.jpg`)) {
    fs.renameSync(`${youtubeId}.jpg`, `${youtubeId}.mp4_preview.jpg`)
  }
  cmd.stopSpin()
}

module.exports = action
