// Node packages.
const fs = require('fs')
const childProcess = require('child_process')
const path = require('path')

// Third party packages.
const chalk = require('chalk')

// Globals.
const { config, cwd } = require('../main.js')

function getRelPath (currentBasePaths) {
  for (const basePath of currentBasePaths) {
    if (cwd.indexOf(basePath) === 0) {
      return cwd.replace(basePath, '')
    }
  }
}

function openFolder (folderPath) {
  if (!fs.existsSync(folderPath)) {
    console.log(`Create directory: ${chalk.yellow(folderPath)}`)
    fs.mkdirSync(folderPath, { recursive: true })
  }
  console.log(`Open directory: ${chalk.green(folderPath)}`)
  const process = childProcess.spawn('xdg-open', [folderPath], { detached: true })
  process.unref()
}

function action () {
  const basePaths = [
    config.mediaServer.basePath,
    '/home/jf/schule-archiv/',
    '/mnt/xpsschulearchiv/'
  ]

  const currentBasePaths = []
  for (const basePath of basePaths) {
    if (fs.existsSync(basePath)) {
      currentBasePaths.push(basePath)
    }
  }

  console.log(`This base paths exist or are accessible: ${chalk.yellow(currentBasePaths)}`)

  const regex = /^[a-zA-Z0-9-_/]+$/g
  if (!regex.test(cwd)) {
    console.log(`The current working directory “${chalk.red(cwd)}” contains illegal characters.`)
    return
  }

  const relPath = getRelPath(currentBasePaths)
  if (relPath) {
    console.log(`Base path detected. The relative path is: ${chalk.yellow(relPath)}`)
  }

  for (const basePath of currentBasePaths) {
    if (relPath) {
      openFolder(path.join(basePath, relPath))
    } else {
      openFolder(basePath)
    }
  }
}

module.exports = {
  command: 'mirror',
  alias: 'm',
  checkExecutable: 'xdg-open',
  description: 'Create a relative path in different base paths. Open this relative paths in the file manager.',
  action
}
