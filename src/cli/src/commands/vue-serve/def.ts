import { CliCommandSpec } from '@bldr/type-definitions'

export = <CliCommandSpec> {
  command: 'vue-serve [app-name]',
  alias: 'vs',
  description: 'Serve the Vue webapp of Lamp',
  checkExecutable: [
    'npm'
  ]
}
