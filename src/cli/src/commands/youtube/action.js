// Node packages.
const fs = require('fs')
const path = require('path')

// Project packages.
const { CommandRunner } = require('@bldr/cli-utils')
const { createYamlOneFile } = require('../yaml/action.js')
const { cwd } = require('../../main.js')
const { LocationIndicator } = require('@bldr/media-server')
const { normalizeOneFile } = require('../normalize/action.js')
const config = require('@bldr/config')
const axios = require('axios').default

async function requestYoutubeApi(youtubeId) {
  const result = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
    params: {
      part: 'snippet',
      id: youtubeId,
      key: config.youtube.apiKey
    }
  })

  const snippet = result.data.items[0].snippet
  return {
    youtubeId,
    originalHeading: snippet.title,
    originalInfo: snippet.description,
  }
}

/**
 *
 */
async function action (youtubeId) {
  const metaData = await requestYoutubeApi(youtubeId)
  console.log(metaData)

  const location = new LocationIndicator()
  const parentDir = location.getPresParentDir(cwd)
  const ytDir = path.join(parentDir, 'YT')
  if (!fs.existsSync(ytDir)) {
    fs.mkdirSync(ytDir)
  }
  const cmd = new CommandRunner({})
  cmd.startSpin()
  cmd.log('Updating youtube-dl using pip3.')
  await cmd.exec('pip3', 'install', '--upgrade', 'youtube-dl')

  cmd.log('Downloading the YouTube video.')
  await cmd.exec(
    'youtube-dl',
    '--format', 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/mp4',
    '--output', youtubeId,
    '--write-thumbnail',
    youtubeId,
    { cwd: ytDir }
  )

  const ytFile = path.resolve(ytDir, `${youtubeId}.mp4`)

  cmd.log('Creating the metadata file in the YAML format.')
  await createYamlOneFile(ytFile, metaData)
  cmd.log('Normalizing the metadata file.')
  await normalizeOneFile(ytFile)

  const srcPreviewJpg = ytFile.replace(/\.mp4$/, '.jpg')
  const srcPreviewWebp = ytFile.replace(/\.mp4$/, '.webp')
  const destPreview = ytFile.replace(/\.mp4$/, '.mp4_preview.jpg')

  if (fs.existsSync(srcPreviewJpg)) {
    fs.renameSync(srcPreviewJpg, destPreview)
  } else if (fs.existsSync(srcPreviewWebp)) {
    await cmd.exec(
      'magick',
      'convert', srcPreviewWebp, destPreview,
      { cwd: ytDir }
    )
    fs.unlinkSync(srcPreviewWebp)
  }
  cmd.stopSpin()
}

module.exports = action
