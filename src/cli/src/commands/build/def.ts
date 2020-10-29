import { CliCommandSpec } from '@bldr/type-definitions'

export = <CliCommandSpec> {
  command: 'build [app-name]',
  alias: 'b',
  description: 'Build the Vue apps',
  checkExecutable: ['npm', 'rsync']
}
