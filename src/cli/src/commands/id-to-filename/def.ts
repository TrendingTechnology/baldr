import { CliCommandSpec } from '@bldr/type-definitions'

export = <CliCommandSpec> {
  command: 'id-to-filename [files...]',
  alias: 'i',
  description: 'Rename media assets after the id.'
}
