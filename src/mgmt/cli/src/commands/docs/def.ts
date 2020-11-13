import { CliCommandSpec } from '@bldr/type-definitions'

export = <CliCommandSpec> {
  command: 'docs [action]',
  alias: 'd',
  description: '[generate|open]: Generate / open the project documentation',
  checkExecutable: ['xdg-open']
}
