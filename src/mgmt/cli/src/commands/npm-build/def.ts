import { validateDefintion } from '../../main.js'

export = validateDefintion({
  command: 'npm-build <file>',
  description:
    'Change to the parent directory of the specified file and run “npm run build”',
  checkExecutable: 'npm'
})
