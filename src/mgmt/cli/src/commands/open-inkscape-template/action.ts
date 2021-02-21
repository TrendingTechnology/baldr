// Node packages
import path from 'path'

// Project packages.
import { CommandRunner } from '@bldr/cli-utils'
import config from '@bldr/config'

/**
 * Open the Inkscape template.
 */
function action () {
  const cmd = new CommandRunner({
    verbose: false
  })
  cmd.exec([
    'inkscape',
    path.join(config.mediaServer.basePath, 'Inkscape-Vorlagen', 'Inkscape-Vorlage.svg')
  ], { detached: true })
}

export = action
