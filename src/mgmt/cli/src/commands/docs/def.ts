import { validateDefintion } from '../../main.js'

export = validateDefintion({
  command: 'docs [action]',
  alias: 'd',
  description: '[generate|open]: Generate / open the project documentation',
  checkExecutable: ['xdg-open']
})
