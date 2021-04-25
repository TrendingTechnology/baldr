// Project packages.
import collectAudioMetaData from '@bldr/audio-metadata'

/**
 * @param {String} audioFile
 */
async function action (filePath: string): Promise<void> {
  const result = await collectAudioMetaData(filePath)
  console.log(result)
}

export = action
