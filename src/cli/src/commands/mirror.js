// Third party packages.
const chalk = require('chalk')

// Project packages:
const { openFolderWithArchives } = require('@bldr/api-media-server')

// Globals.
const { cwd } = require('../main.js')

function action (cmdObj) {
  const regex = /^[a-zA-Z0-9-_/]+$/g
  if (!regex.test(cwd)) {
    console.log(`The current working directory “${chalk.red(cwd)}” contains illegal characters.`)
    return
  }
  console.log(openFolderWithArchives(cwd, cmdObj.createDirs))
}

module.exports = {
  command: 'mirror',
  alias: 'm',
  options: [
    ['-c, --create-dirs', 'Create missings directories of the relative path, if they are not existent.']
  ],
  checkExecutable: 'xdg-open',
  description: 'Create a relative path in different base paths. Open this relative paths in the file manager.',
  action
}
