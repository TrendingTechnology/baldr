import fs from 'fs'
import path from 'path'
import childProcess from 'child_process'

// Project packages.
import { CommandRunner } from '@bldr/cli-utils'
import { youtubeMModule } from '@bldr/presentation-parser'
import { MediaDataTypes } from '@bldr/type-definitions'
import { operations, locationIndicator } from '@bldr/media-manager'
import * as log from '@bldr/log'

interface VideoMeta {
  youtubeId: string
  originalHeading: string
  originalInfo: string
}

async function requestYoutubeApi (
  youtubeId: string
): Promise<VideoMeta | undefined> {
  const snippet = await youtubeMModule.getSnippet(youtubeId)
  if (snippet != null) {
    return {
      youtubeId,
      originalHeading: snippet.title,
      originalInfo: snippet.description
    }
  }
}

function parseYoutubeDlProgressStdOut (cmd: CommandRunner, stdout: string): void {
  // [download]   2.9% of 118.39MiB at 82.11KiB/s ETA 23:53
  // [download]  66.8% of 118.39MiB at 61.29KiB/s ETA 10:56
  const regExp = /\[download\]\s*(?<progress>.*)\s+of\s+(?<size>.*)\s+at\s+(?<speed>.*)\s+ETA\s+(?<eta>.*)/gim
  const match = regExp.exec(stdout)
  if (match != null) {
    cmd.log(
      log.format('download %s of %s at %s ETA %s', [
        match.groups?.progress,
        match.groups?.size,
        match.groups?.speed,
        match.groups?.eta
      ])
    )
  }
}

async function downloadVideo (
  cmd: CommandRunner,
  youtubeId: string,
  parentDir: string
): Promise<string> {
  return await new Promise((resolve, reject) => {
    const command = childProcess.spawn(
      'youtube-dl',
      [
        '--format',
        'bestvideo[ext=mp4]+bestaudio[ext=m4a]/mp4',
        '--output',
        youtubeId,
        '--write-thumbnail',
        youtubeId
      ],
      { cwd: parentDir }
    )

    let stdout: string = ''
    let stderr: string = ''

    command.stdout.on('data', (data: Buffer) => {
      parseYoutubeDlProgressStdOut(cmd, data.toString())
      stdout = stdout + data.toString()
    })

    // somehow songbook build stays open without this event.
    command.stderr.on('data', (data: Buffer) => {
      stderr = stderr + data.toString()
    })

    command.on('error', code => {
      reject(new Error(stderr))
    })

    command.on('exit', code => {
      if (code === 0) {
        resolve(youtubeId)
      } else {
        reject(new Error(stderr))
      }
    })
  })
}

/**
 *
 */
async function action (youtubeId: string): Promise<void> {
  const meta = (await requestYoutubeApi(youtubeId)) as unknown
  if (meta == null) {
    log.error('Metadata of the YouTube video “%s” could not be fetched.', [
      youtubeId
    ])
    return
  }

  const metaData = meta as MediaDataTypes.AssetMetaData
  log.verboseAny(metaData)

  const parentDir = locationIndicator.getPresParentDir(process.cwd())
  if (parentDir == null) {
    throw new Error('You are not in a presentation folder!')
  }
  const ytDir = path.join(parentDir, 'YT')
  if (!fs.existsSync(ytDir)) {
    fs.mkdirSync(ytDir)
  }
  const cmd = new CommandRunner({ verbose: true })
  cmd.startSpin()
  cmd.log('Updating youtube-dl using pip3.')
  await cmd.exec(['pip3', 'install', '--upgrade', 'youtube-dl'])

  cmd.log('Downloading the YouTube video.')

  // [download]   2.9% of 118.39MiB at 82.11KiB/s ETA 23:53
  await downloadVideo(cmd, youtubeId, ytDir)

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
    await cmd.exec(['magick', 'convert', srcPreviewWebp, destPreview], {
      cwd: ytDir
    })
    fs.unlinkSync(srcPreviewWebp)
  }
  cmd.stopSpin()
}

export = action
