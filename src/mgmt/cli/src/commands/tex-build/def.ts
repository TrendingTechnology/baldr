import { validateDefintion } from '../../main.js'

export = validateDefintion({
  command: 'tex-build [files...]',
  alias: 'tb',
  description: 'Build TeX files.',
  checkExecutable: [
    'lualatex'
  ]
})
