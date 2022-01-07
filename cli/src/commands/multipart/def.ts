import { validateDefintion } from '../../main.js'

export = validateDefintion({
  command: 'multipart <glob> <prefix>',
  alias: 'mp',
  options: [
    ['-d, --dry-run', 'Test first']
  ],
  description: 'Rename multipart assets. Example “b mp "*.jpg" Systeme”'
})
