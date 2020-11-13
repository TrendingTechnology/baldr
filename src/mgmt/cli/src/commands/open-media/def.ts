import { CliCommandSpec } from '@bldr/type-definitions'

export = <CliCommandSpec> {
  command: 'open-media',
  alias: 'o',
  checkExecutable: 'xdg-open',
  description: 'Open the base directory of the media server in the file manager.'
}
