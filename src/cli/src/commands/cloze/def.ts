import { CliCommandSpec } from '@bldr/type-definitions'

export = <CliCommandSpec> {
  command: 'cloze [input]',
  alias: 'cl',
  checkExecutable: ['pdfinfo', 'pdf2svg', 'lualatex'],
  description: 'Generate from TeX files with cloze texts SVGs for baldr.'
}
