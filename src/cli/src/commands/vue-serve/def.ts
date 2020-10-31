import { CliCommandSpec } from '@bldr/type-definitions'

export = <CliCommandSpec> {
  command: 'vue-serve [app-name]',
  alias: 'vs',
  description: 'Serve a Vue web app.',
  checkExecutable: [
    'npm'
  ]
}
