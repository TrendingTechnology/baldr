// Node packages.
import path from 'path'

// Project packages.
import { CommandRunner } from '@bldr/cli-utils'
import { getConfig } from '@bldr/config-ng'

const config = getConfig()

/**
 * Serve a Vue web app.
 *
 * @param appName - The name of the Vue app = parent folder of the app.
 */
async function action (appName: string = 'lamp'): Promise<void> {
  const appPath = path.join(config.localRepo, 'src', 'vue', 'apps', appName)
  const cmd = new CommandRunner({ verbose: true })
  await cmd.exec(['npm', 'run', 'serve:webapp'], { cwd: appPath })
}

export = action
