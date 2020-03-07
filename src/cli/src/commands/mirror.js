// Node packages.
const fs = require('fs')
const os = require('os')
const path = require('path')

// Third party packages.
const chalk = require('chalk')

// Project packages:
const { openWith } = require('@bldr/api-media-server')

// Globals.
const { config, cwd } = require('../main.js')

/**
 * Get the relative path of one of the base paths retrieved by the function
 * `getBaseAndArchivePaths()` and the current working directory (cwd).
 *
 * @param {Array} currentBasePaths
 *
 * @returns {String}
 */
function getRelPath (currentBasePaths) {
  let relPath
  for (const basePath of currentBasePaths) {
    if (cwd.indexOf(basePath) === 0) {
      relPath = cwd.replace(basePath, '')
      break
    }
  }
  return relPath.replace(new RegExp(`^${path.sep}`), '')
}

/**
 *
 * @param {String} filePath
 *
 * @see {@link https://stackoverflow.com/a/36221905/10193818}
 */
function untildify (filePath) {
  if (filePath[0] === '~') {
    return path.join(os.homedir(), filePath.slice(1))
  }
  return filePath
}

/**
 * Merge the configurations entries of `config.mediaServer.basePath` and
 * `config.mediaServer.archivePaths`. Retrieve only the accessible ones.
 *
 * @returns An array of directory paths in this order: First the main
 *   base path of the media server, then one ore more archive directory
 *   paths. The paths are checked for existence and resolved (untildified).
 */
function getBaseAndArchivePaths () {
  const basePaths = [
    config.mediaServer.basePath,
    ...config.mediaServer.archivePaths
  ]
  const result = []
  for (let i = 0; i < basePaths.length; i++) {
    basePaths[i] = path.resolve(untildify(basePaths[i]))
    if (fs.existsSync(basePaths[i])) {
      result.push(basePaths[i])
    }
  }
  return result
}

function openFolder (folderPath, createDirs) {
  if (createDirs && !fs.existsSync(folderPath)) {
    console.log(`Create directory: ${chalk.yellow(folderPath)}`)
    fs.mkdirSync(folderPath, { recursive: true })
  }
  if (fs.existsSync(folderPath)) {
    console.log(`Open directory: ${chalk.green(folderPath)}`)
    openWith('xdg-open', folderPath)
  }
}

function action (cmdObj) {
  const currentBasePaths = getBaseAndArchivePaths()

  console.log(`These base paths exist or are accessible: ${chalk.yellow(currentBasePaths)}`)

  const regex = /^[a-zA-Z0-9-_/]+$/g
  if (!regex.test(cwd)) {
    console.log(`The current working directory “${chalk.red(cwd)}” contains illegal characters.`)
    return
  }

  const relPath = getRelPath(currentBasePaths)
  if (relPath) {
    console.log(`The relative path is: ${chalk.yellow(relPath)}`)
  }

  for (const basePath of currentBasePaths) {
    if (relPath) {
      openFolder(path.join(basePath, relPath), cmdObj.createDirs)
    } else {
      openFolder(basePath, cmdObj.createDirs)
    }
  }
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
