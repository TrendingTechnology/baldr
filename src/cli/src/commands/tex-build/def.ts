import { CliCommandSpec } from '@bldr/type-definitions'

export = <CliCommandSpec> {
  command: 'tex-build [files...]',
  alias: 'tb',
  description: 'Build TeX files.',
  checkExecutable: [
    'lualatex'
  ]
}
