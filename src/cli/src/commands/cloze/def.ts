import { validateDefintion } from '../../main.js'

export = validateDefintion({
  command: 'cloze [input]',
  alias: 'cl',
  checkExecutable: ['pdfinfo', 'pdf2svg', 'lualatex'],
  description: 'Generate from TeX files with cloze texts SVGs for baldr.'
})
