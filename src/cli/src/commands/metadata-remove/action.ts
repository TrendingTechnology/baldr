
// Project packages.
import { CommandRunner } from '@bldr/cli-utils'
import { getExtension } from '@bldr/string-format'

async function action (filePath: string): Promise<void> {
  const cmd = new CommandRunner({
    verbose: true
  })

  const extension = getExtension(filePath)
  if (extension != null) {
    const dest = filePath.replace('.' + extension, '_no-metadata.' + extension)

    cmd.startSpin()
    await cmd.exec([
      'ffmpeg', '-i', filePath,
      '-map_metadata', '-1',
      '-c:v', 'copy', '-c:a', 'copy',
      dest
    ])
    cmd.stopSpin()
  }
}

export = action
