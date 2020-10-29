import { CliCommandSpec } from '@bldr/type-definitions'

export = <CliCommandSpec> {
  command: 'titles-from-tex [files...]',
  alias: 'tf',
  options: [
    ['-f, --force', 'Overwrite existing `title.txt` files.']
  ],
  description: 'TeX files to folder titles title.txt'
}
