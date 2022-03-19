import { validateDefintion } from '../../main.js'

export default validateDefintion({
  command: 'cloze [input]',
  alias: 'cl',
  checkExecutable: ['pdfinfo', 'pdf2svg', 'lualatex'],
  description: 'Generate SVG files for the presentation from a TeX file with cloze texts.'
})
