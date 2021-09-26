// Project packages.
import collectAudioMetaData from '@bldr/audio-metadata'

import * as log from '@bldr/log'

/**
 * @param {String} audioFile
 */
async function action (filePath: string): Promise<void> {
  const result = await collectAudioMetaData(filePath)
  log.info(result)
}

export = action
