import { CliCommandSpec } from '@bldr/type-definitions'

export = <CliCommandSpec> {
  command: 'yaml-validate [files...]',
  alias: 'yv',
  description: 'Validate the YAML files.'
}
