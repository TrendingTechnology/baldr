import { validateDefintion } from '../../main.js'

export = validateDefintion({
  command: 'build [app-name]',
  alias: 'b',
  description: 'Build the Vue apps',
  checkExecutable: ['npm', 'rsync']
})
