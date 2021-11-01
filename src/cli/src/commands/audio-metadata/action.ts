// Project packages.
import { collectAudioMetadata } from '@bldr/audio-metadata'

import * as log from '@bldr/log'

/**
 * @param {String} audioFile
 */
async function action (filePath: string): Promise<void> {
  const result = await collectAudioMetadata(filePath)
  log.infoAny(result)
}

export = action
