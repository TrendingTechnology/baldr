// Project packages:
import { CommandRunner } from '@bldr/cli-utils'

/**
 * Open a Vue app in Chromium.
 *
 * @param relPath - The relative path of the Vue app. The app name must
 *   be the same as the parent directory.
 */
function action (relPath: string): void {
  if (!relPath) relPath = 'presentation'
  const cmd = new CommandRunner()
  cmd.exec(
    ['/usr/bin/chromium-browser',
    `--app=http://localhost/${relPath}`],
    { detached: true }
  )
}

export = action
