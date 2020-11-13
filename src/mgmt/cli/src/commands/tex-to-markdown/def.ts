import { CliCommandSpec } from '@bldr/type-definitions'

export = <CliCommandSpec> {
  command: 'tex-to-markdown [files-or-text...]',
  alias: 'tm',
  description: 'Convert TeX to markdown.'
}
