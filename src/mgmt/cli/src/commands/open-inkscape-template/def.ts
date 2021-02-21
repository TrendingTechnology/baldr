import { CliCommandSpec } from '@bldr/type-definitions'

export = <CliCommandSpec> {
  command: 'open-inkscape-template',
  alias: 'oi',
  checkExecutable: 'inkscape',
  description: 'Open the Inkscape template.'
}
