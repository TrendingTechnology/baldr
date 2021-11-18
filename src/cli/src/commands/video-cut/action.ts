// Project packages.
import { CommandRunner } from '@bldr/cli-utils'

import { convertDurationToSeconds } from '@bldr/core-browser'

async function action (
  videoFilePath: string,
  time1: string,
  time2: string
): Promise<void> {
  const cmd = new CommandRunner({ verbose: true })

  let startSec = 0
  let endSec
  if (time2 == null) {
    endSec = convertDurationToSeconds(time1)
  } else {
    startSec = convertDurationToSeconds(time1)
    endSec = convertDurationToSeconds(time2)
  }

  cmd.startSpin()
  await cmd.exec([
    'MP4Box',
    '-splitx',
    `${startSec}:${endSec}`,
    '"' + videoFilePath + '"'
  ])
  cmd.stopSpin()
}

export = action
