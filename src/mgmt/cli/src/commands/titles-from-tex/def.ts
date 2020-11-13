import { CliCommandSpec } from '@bldr/type-definitions'

export = <CliCommandSpec> {
  command: 'titles-from-tex [files...]',
  alias: 'tf',
  options: [
    ['-f, --force', 'Overwrite existing `title.txt` files.']
  ],
  description: 'Create from the TeX files the folder titles text file `title.txt`.'
}
