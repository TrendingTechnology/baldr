import { validateDefintion } from '../../main.js'

export = validateDefintion({
  command: 'goto',
  alias: 'g',
  options: [
    ['-m, --file-manager', 'Open the file manager.']
  ],
  description: 'Change the directory in the terminal (a new terminal session is openend). Change from the main media directory structure to the corresponding archive folder and vice versa.',
  checkExecutable: ['zsh']
})
