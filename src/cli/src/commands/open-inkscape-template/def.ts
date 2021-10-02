import { validateDefintion } from '../../main.js'

export = validateDefintion({
  command: 'open-inkscape-template',
  alias: 'oi',
  checkExecutable: 'inkscape',
  description: 'Open the Inkscape template.'
})
