// Node packages.
const fs = require('fs')
const childProcess = require('child_process')
const path = require('path')

// Third party packages.
const chalk = require('chalk')

const { config } = require('../main.js')

/**
 * Create and open a relative path in different base paths.
 */
function action () {
  function getRelPath () {
    for (const basePath of currentBasePaths) {
      if (cwd.indexOf(basePath) === 0) {
        return cwd.replace(basePath, '')
      }
    }
  }

  const basePaths = [
    config.mediaServer.basePath,
    '/home/jf/schule-archiv/'
  ]

  const currentBasePaths = []
  for (const basePath of basePaths) {
    if (fs.existsSync(basePath)) {
      currentBasePaths.push(basePath)
    }
  }

  console.log(`This base paths exist or are accessible: ${chalk.yellow(currentBasePaths)}`)

  const cwd = process.cwd()

  const regex = /^[a-zA-Z0-9-_/]+$/g
  if (!regex.test(cwd)) {
    console.log(`The current working directory “${chalk.red(cwd)}” contains illegal characters.`)
    return
  }

  const relPath = getRelPath()
  if (!relPath) {
    console.log(`Move to one of this base paths: ${chalk.red(basePaths)}`)
    throw new Error(`Wrong current dir.`)
  } else {
    console.log(`Base path detected. The relative path is: ${chalk.yellow(relPath)}`)
  }

  for (const basePath of currentBasePaths) {
    const absPath = path.join(basePath, relPath)
    if (!fs.existsSync(absPath)) {
      console.log(`Create directory: ${chalk.yellow(absPath)}`)
      fs.mkdirSync(absPath, { recursive: true })
    }
    console.log(`Open directory: ${chalk.green(absPath)}`)
    const process = childProcess.spawn('xdg-open', [absPath], { detached: true })
    process.unref()
  }
}

module.exports = {
  commandName: 'mirror',
  alias: 'm',
  checkExecutable: 'xdg-open',
  description: 'Create and open in the file explorer a relative path in different base paths.',
  action
}
