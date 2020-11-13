import { CliCommandSpec } from '@bldr/type-definitions'

export = <CliCommandSpec> {
  command: 'build-electron [app-name]',
  alias: 'be',
  description: 'Build the Electron apps.',
  checkExecutable: ['npm']
}
