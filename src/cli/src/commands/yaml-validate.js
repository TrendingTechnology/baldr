// Node packages.
const fs = require('fs')

// Third party packages.
const chalk = require('chalk')
const yaml = require('js-yaml')

// Project packages.
const mediaServer = require('@bldr/api-media-server')

/**
 * @param {String} filePath - The media file path.
 */
function validateYamlOneFile (filePath) {
  console.log(`Validate: ${chalk.yellow(filePath)}`)
  try {
    const result = yaml.safeLoad(fs.readFileSync(filePath, 'utf8'))
    console.log(chalk.green('ok!'))
    console.log(result)
  } catch (error) {
    console.log(`${chalk.red(error.name)}: ${error.message}`)
  }
}

/**
 * @param {String} filePath - The media file path.
 */
function action (filePath) {
  if (filePath) {
    validateYamlOneFile(filePath)
  } else {
    mediaServer.walk(process.cwd(), {
      everyFile (relPath) {
        if (relPath.toLowerCase().indexOf('.yml') > -1) {
          validateYamlOneFile(relPath)
        }
      }
    })
  }
}

module.exports = action
