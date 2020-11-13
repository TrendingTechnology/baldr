import { CliCommandSpec } from '@bldr/type-definitions'

export = <CliCommandSpec> {
  command: 'yaml [files...]',
  alias: 'y',
  description: 'Create info files in the YAML format in the current working directory.'
}
