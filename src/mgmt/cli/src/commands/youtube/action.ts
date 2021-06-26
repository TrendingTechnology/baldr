// Node packages.
import fs from 'fs'
import path from 'path'

// Project packages.
import type { AssetType } from '@bldr/type-definitions'

import { CommandRunner } from '@bldr/cli-utils'
import { operations, locationIndicator } from '@bldr/media-manager'
import { getSnippet } from '@bldr/youtube-api'
import * as log from '@bldr/log'

interface VideoMeta {
  youtubeId: string
  originalHeading: string
  originalInfo: string
}

async function requestYoutubeApi (youtubeId: string): Promise<VideoMeta | undefined> {
  const snippet = await getSnippet(youtubeId)
  if (snippet != null) {
    return {
      youtubeId,
      originalHeading: snippet.title,
      originalInfo: snippet.description
    }
  }
}

/**
 *
 */
async function action (youtubeId: string): Promise<void> {
  const meta = await requestYoutubeApi(youtubeId) as unknown
  if (meta == null) {
    log.error('Metadata of the YouTube video “%s” could not be fetched.', youtubeId)
    return
  }

  const metaData = meta as AssetType.YamlFormat
  console.log(metaData)

  const parentDir = locationIndicator.getPresParentDir(process.cwd())
  const ytDir = path.join(parentDir, 'YT')
  if (!fs.existsSync(ytDir)) {
    fs.mkdirSync(ytDir)
  }
  const cmd = new CommandRunner()
  cmd.startSpin()
  cmd.log('Updating youtube-dl using pip3.')
  await cmd.exec(['pip3', 'install', '--upgrade', 'youtube-dl'])

  cmd.log('Downloading the YouTube video.')
  await cmd.exec(
    [
      'youtube-dl',
      '--format', 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/mp4',
      '--output', youtubeId,
      '--write-thumbnail',
      youtubeId
    ],
    { cwd: ytDir }
  )

  const ytFile = path.resolve(ytDir, `${youtubeId}.mp4`)

  cmd.log('Creating the metadata file in the YAML format.')
  metaData.categories = 'youtube'
  await operations.initializeMetaYaml(ytFile, metaData)
  cmd.log('Normalizing the metadata file.')
  await operations.normalizeMediaAsset(ytFile)

  const srcPreviewJpg = ytFile.replace(/\.mp4$/, '.jpg')
  const srcPreviewWebp = ytFile.replace(/\.mp4$/, '.webp')
  const destPreview = ytFile.replace(/\.mp4$/, '.mp4_preview.jpg')

  if (fs.existsSync(srcPreviewJpg)) {
    fs.renameSync(srcPreviewJpg, destPreview)
  } else if (fs.existsSync(srcPreviewWebp)) {
    await cmd.exec(
      ['magick',
        'convert', srcPreviewWebp, destPreview],
      { cwd: ytDir }
    )
    fs.unlinkSync(srcPreviewWebp)
  }
  cmd.stopSpin()
}

export = action
