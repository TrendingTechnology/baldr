import { validateDefintion } from '../../main.js'

export = validateDefintion({
  command: 'git-update',
  alias: 'gu',
  description: 'Run git pull on the media folder.',
  checkExecutable: [
    'git'
  ]
})
