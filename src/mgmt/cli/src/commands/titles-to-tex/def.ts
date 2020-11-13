import { CliCommandSpec } from '@bldr/type-definitions'

export = <CliCommandSpec> {
  command: 'titles-to-tex [files...]',
  alias: 't',
  description: 'Replace the title section of the TeX files with metadata retrieved from the title.txt files.'
}
