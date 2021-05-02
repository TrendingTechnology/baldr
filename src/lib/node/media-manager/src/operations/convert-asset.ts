// Node packages.
import childProcess from 'child_process'
import path from 'path'

// Project packages.
import collectAudioMetaData from '@bldr/audio-metadata'

import { makeAsset } from '../media-file-classes'
import { writeMetaDataYaml } from '../yaml'
import { idify } from '@bldr/core-browser'
import { AssetType } from '@bldr/type-definitions'
import { mimeTypeManager } from '@bldr/client-media-models'

/**
 * A set of output file paths. To avoid duplicate rendering by a second
 * run of the script.
 *
 * First run: `01 Hintergrund.MP3` -> `01-Hintergrund.m4a`
 *
 * Second run:
 * - not:
 *   1. `01 Hintergrund.MP3` -> `01-Hintergrund.m4a`
 *   2. `01-Hintergrund.m4a` -> `01-Hintergrund.m4a` (bad)
 * - but:
 *   1. `01 Hintergrund.MP3` -> `01-Hintergrund.m4a`
 */
const converted: Set<string> = new Set()

/**
 * Convert a media asset file.
 *
 * @param filePath - The path of the input file.
 * @param cmdObj - The command object from the commander.
 *
 * @returns The output file path.
 */
export async function convertAsset (filePath: string, cmdObj: { [key: string]: any } = {}): Promise<string| undefined> {
  const asset = makeAsset(filePath)

  if (asset.extension == null) {
    return
  }
  let mimeType: string
  try {
    mimeType = mimeTypeManager.extensionToType(asset.extension)
  } catch (error) {
    console.log(`Unsupported extension ${asset.extension}`)
    return
  }
  const outputExtension = mimeTypeManager.typeToTargetExtension(mimeType)
  const outputFileName = `${idify(asset.basename)}.${outputExtension}`
  let outputFile = path.join(path.dirname(filePath), outputFileName)
  if (converted.has(outputFile)) return

  let process: childProcess.SpawnSyncReturns<string> | undefined

  // audio
  // https://trac.ffmpeg.org/wiki/Encode/AAC

  // ffmpeg aac encoder
  // '-c:a', 'aac', '-b:a', '128k',

  // aac_he
  // '-c:a', 'libfdk_aac', '-profile:a', 'aac_he','-b:a', '64k',

  // aac_he_v2
  // '-c:a', 'libfdk_aac', '-profile:a', 'aac_he_v2'

  if (mimeType === 'audio') {
    process = childProcess.spawnSync('ffmpeg', [
      '-i', filePath,
      // '-c:a', 'aac', '-b:a', '128k',
      // '-c:a', 'libfdk_aac', '-profile:a', 'aac_he', '-b:a', '64k',
      '-c:a', 'libfdk_aac', '-vbr', '2',
      // '-c:a', 'libfdk_aac', '-profile:a', 'aac_he_v2',
      '-vn', // Disable video recording
      '-map_metadata', '-1', // remove metadata
      '-y', // Overwrite output files without asking
      outputFile
    ])

  // image
  } else if (mimeType === 'image') {
    let size = '2000x2000>'
    if (cmdObj.previewImage != null) {
      outputFile = filePath.replace(`.${asset.extension}`, '_preview.jpg')
      size = '1000x1000>'
    }
    process = childProcess.spawnSync('magick', [
      'convert',
      filePath,
      '-resize', size, // http://www.imagemagick.org/Usage/resize/#shrink
      '-quality', '60', // https://imagemagick.org/script/command-line-options.php#quality
      outputFile
    ])

  // videos
  } else if (mimeType === 'video') {
    process = childProcess.spawnSync('ffmpeg', [
      '-i', filePath,
      '-vcodec', 'libx264',
      '-profile:v', 'baseline',
      '-y', // Overwrite output files without asking
      outputFile
    ])
  }

  if (process != null) {
    if (process.status !== 0 && mimeType === 'audio') {
      // A second attempt for mono audio: HEv2 only makes sense with stereo.
      // see http://www.ffmpeg-archive.org/stereo-downmix-error-aac-HEv2-td4664367.html
      process = childProcess.spawnSync('ffmpeg', [
        '-i', filePath,
        '-c:a', 'libfdk_aac', '-profile:a', 'aac_he', '-b:a', '64k',
        '-vn', // Disable video recording
        '-map_metadata', '-1', // remove metadata
        '-y', // Overwrite output files without asking
        outputFile
      ])
    }

    if (process.status === 0) {
      if (mimeType === 'audio') {
        let metaData
        try {
          metaData = await collectAudioMetaData(filePath) as unknown
        } catch (error) {
          console.log(error)
        }
        if (metaData != null) {
          writeMetaDataYaml(outputFile, metaData as AssetType.YamlFormat)
        }
      }
      converted.add(outputFile)
    } else {
      console.log(process.stdout.toString())
      console.log(process.stderr.toString())
      throw new Error(`ConvertError: ${filePath} -> ${outputFile}`)
    }
  }
  return outputFile
}
