// Project packages:
import { CommandRunner } from '@bldr/cli-utils'

/**
 * Open a Vue app in Chromium.
 *
 * @param relPath - The relative path of the Vue app. The app name must
 *   be the same as the parent directory.
 */
async function action (relPath: string): Promise<void> {
  if (relPath == null) relPath = 'presentation'
  const cmd = new CommandRunner()
  await cmd.exec(
    ['/usr/bin/chromium-browser',
    `--app=http://localhost/${relPath}`],
    { detached: true }
  )
}

export = action
