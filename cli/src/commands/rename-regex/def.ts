import { validateDefintion } from '../../main.js'

export default validateDefintion({
  command: 'rename-regex <pattern> <replacement> [path]',
  alias: 'rr',
  description: 'Rename files by regex. see String.prototype.replace()'
})
