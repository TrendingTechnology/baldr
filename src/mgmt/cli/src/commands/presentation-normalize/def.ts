import { CliCommandSpec } from '@bldr/type-definitions'

export = <CliCommandSpec> {
  command: 'presentation-normalize [files...]',
  alias: 'pn',
  description: 'Normalize a presentation file (Remove unnecessary single quotes).'
}
