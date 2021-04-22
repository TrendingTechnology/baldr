import { validateDefintion } from '../../main.js'

export = validateDefintion({
  command: 'build-electron [app-name]',
  alias: 'be',
  description: 'Build the Electron apps.',
  checkExecutable: ['npm']
})
