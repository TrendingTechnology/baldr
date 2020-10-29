// Node packages.
import * as childProcess from 'child_process'

// Project packages.
import config from '@bldr/config'

/**
 * Open base path.
 */
function action () {
  const process = childProcess.spawn('xdg-open', [config.mediaServer.basePath], { detached: true })
  process.unref()
}

export = action
