// Project packages.
import fs from 'fs'

import * as log from '@bldr/log'
import { readYamlFile } from '@bldr/file-reader-writer'
import { fetchFile } from '@bldr/node-utils'
import { CommandRunner } from '@bldr/cli-utils'
import { mimeTypeManager, walk } from '@bldr/media-manager'
import { extractCoverImage } from '@bldr/audio-metadata'

interface Options {
  seconds: number
  force: boolean
}

const cmd = new CommandRunner({ verbose: true })

const WAVEFORM_DEFAULT_HEIGHT = 500

// width = duration * factor
const WAVEFORM_WIDTH_FACTOR = 20

function getDuration (srcPath: string): number {
  const result = cmd.execSync([
    'ffprobe',
    '-v',
    'quiet',
    '-show_entries',
    'format=duration',
    '-of',
    'default=noprint_wrappers=1:nokey=1',
    srcPath
  ])

  if (result.stdout == null) {
    throw new Error('Duration couldn’t be detected')
  }
  return Number(result.stdout)
}

async function createAudioWaveForm (srcPath: string): Promise<void> {
  const duration = getDuration(srcPath)
  let widthFactor = WAVEFORM_WIDTH_FACTOR
  if (duration < 5) {
    widthFactor = WAVEFORM_WIDTH_FACTOR * 24
  } else if (duration < 10) {
    widthFactor = WAVEFORM_WIDTH_FACTOR * 12
  } else if (duration < 60) {
    widthFactor = WAVEFORM_WIDTH_FACTOR * 6
  }
  const width = (duration * widthFactor).toFixed(0)
  const destPath = `${srcPath}_waveform.png`
  cmd.execSync([
    'ffmpeg',
    // '-t', '60',
    '-i',
    srcPath,
    '-filter_complex',
    `aformat=channel_layouts=mono,compand,showwavespic=size=${width}x${WAVEFORM_DEFAULT_HEIGHT}:colors=black`,
    '-frames:v',
    '1',
    '-y', // Overwrite output files without asking
    destPath
  ])
  log.verbose('Create waveform image %s from %s.', [destPath, srcPath])
}

async function downloadAudioCoverImage (
  metaData: Record<string, any>,
  destPath: string
): Promise<void> {
  if (metaData.coverSource != null) {
    await fetchFile(metaData.coverSource, destPath)
    log.verbose('Download preview image %s from %s.', [
      destPath,
      metaData.coverSource
    ])
  } else {
    log.error('No property “cover_source” found.')
  }
}

async function extractAudioCoverFromMetadata (
  srcPath: string,
  destPath: string
): Promise<void> {
  if (!fs.existsSync(destPath)) {
    await extractCoverImage(srcPath, destPath)
  }
}

/**
 * Create a video preview image.
 */
function extractFrameFromVideo (
  srcPath: string,
  destPath: string,
  second: number = 10
): void {
  let secondString: string
  if (typeof second === 'number') {
    secondString = second.toString()
  } else {
    secondString = second
  }
  cmd.execSync([
    'ffmpeg',
    '-i',
    srcPath,
    '-ss',
    secondString, // Position in seconds
    '-vframes',
    '1', // only handle one video frame
    '-qscale:v',
    '10', // Effective range for JPEG is 2-31 with 31 being the worst quality.
    '-y', // Overwrite output files without asking
    destPath
  ])
  log.verbose('Create preview image %s of a video file.', [destPath])
}

function convertFirstPdfPageToJpg (srcPath: string, destPath: string): void {
  destPath = destPath.replace('.jpg', '')
  cmd.execSync([
    'pdftocairo',
    '-jpeg',
    '-jpegopt',
    'quality=30,optimize=y',
    '-singlefile',
    '-scale-to',
    '500',
    srcPath,
    destPath
  ])
  log.verbose('Create preview image %s of a PDF file.', [destPath])
}

async function createPreviewOneFile (
  srcPath: string,
  options: Options
): Promise<void> {
  log.info('Create preview files for %s', [srcPath])
  const mimeType = mimeTypeManager.filePathToType(srcPath)
  log.debug('The MIME type of the file is %s', [mimeType])
  const destPathPreview = `${srcPath}_preview.jpg`
  const destPathWavefrom = `${srcPath}_waveform.png`

  if (
    mimeType === 'audio' &&
    (!fs.existsSync(destPathWavefrom) || options?.force)
  ) {
    await createAudioWaveForm(srcPath)
  }

  if (fs.existsSync(destPathPreview) && !options.force) {
    return
  }

  if (mimeType === 'video') {
    extractFrameFromVideo(srcPath, destPathPreview, options.seconds)
  } else if (mimeType === 'document') {
    convertFirstPdfPageToJpg(srcPath, destPathPreview)
  } else if (mimeType === 'audio') {
    const yamlFile = `${srcPath}.yml`
    const metaData = readYamlFile(yamlFile)
    if (metaData.cover != null) {
      return
    }
    await downloadAudioCoverImage(metaData, destPathPreview)
    await extractAudioCoverFromMetadata(srcPath, destPathPreview)
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
export default async function action (
  filePaths: string[],
  cmdObj: Options
): Promise<void> {
  await walk(
    {
      async asset (relPath) {
        await createPreviewOneFile(relPath, cmdObj)
      }
    },
    {
      path: filePaths
    }
  )
}
