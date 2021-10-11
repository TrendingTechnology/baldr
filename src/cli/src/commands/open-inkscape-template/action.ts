// Node packages
import path from 'path'

// Project packages.
import { CommandRunner } from '@bldr/cli-utils'
import config from '@bldr/config'

/**
 * Open the Inkscape template.
 */
async function action (): Promise<void> {
  const cmd = new CommandRunner({
    verbose: false
  })
  await cmd.exec(
    [
      'inkscape',
      path.join(
        config.mediaServer.basePath,
        'faecheruebergreifend',
        'Inkscape-Vorlagen',
        'Inkscape-Vorlage.svg'
      )
    ],
    { detached: true }
  )
}

export = action
