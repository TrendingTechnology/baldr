// Project packages.
import collectAudioMetaData from '@bldr/audio-metadata'

/**
 * @param {String} audioFile
 */
async function action (filePath: string) {
  const result = await collectAudioMetaData(filePath)
  console.log(result)
}

export = action
