// Node packages.

// Project packages.
import { CommandRunner } from '@bldr/cli-utils'

/**
 */
async function action (filePath: string): Promise<void> {
  const cmd = new CommandRunner({
    verbose: true
  })

  cmd.startSpin()
  cmd.exec(['ffmpeg', '-i',
  '-to', '120',
  '-af', 'afade=t=out:st=110:d=10',
  '-map_metadata',
  '$OUTPUT'])
}

export = action
