/**
 * Cache the audio metadata.
 *
 * @module @bldr/media-categories/audio-metadata
 */

import {
  AudioMetadataContainer,
  collectAudioMetadata
} from '@bldr/audio-metadata'

const cache: {
  [filePath: string]: AudioMetadataContainer
} = {}

async function getAudioMetadata (
  filePath: string
): Promise<AudioMetadataContainer | undefined> {
  if (cache[filePath] == null) {
    return await collectAudioMetadata(filePath)
  }
  return cache[filePath]
}

export async function getAudioMetadataValue (
  fieldName: keyof AudioMetadataContainer,
  filePath?: string
): Promise<string | number | undefined> {
  if (filePath != null) {
    const metadata = await getAudioMetadata(filePath)
    if (metadata?.[fieldName] != null) {
      return metadata[fieldName]
    }
  }
}
