// Third party packages.
const chalk = require('chalk')

// Project packages:
const { openFolderWithArchives } = require('@bldr/api-media-server')

// Globals.
const { cwd } = require('../../main.js')

function action (filePath, cmdObj) {
  if (!filePath) {
    filePath = cwd
  }
  const regex = /^[a-zA-Z0-9-_/]+$/g
  if (!regex.test(filePath)) {
    console.log(`The current working directory “${chalk.red(filePath)}” contains illegal characters.`)
    return
  }
  console.log(openFolderWithArchives(filePath, cmdObj.createDirs))
}

module.exports = action
