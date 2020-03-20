// Node packages.
const childProcess = require('child_process')

// Third party packages.
const chalk = require('chalk')

// Project packages.
const mediaServer = require('@bldr/api-media-server')

function buildOneFile (filePath) {
  // -cd Change to directory of source file when processing it
  // -gg Super go mode: clean out generated files (-CA), and then process files
  // regardless of file timestamps
  let process = childProcess.spawnSync('latexmk', ['-cd', '-gg', '-lualatex', filePath])
  if (process.status === 0) {
    console.log(chalk.green('OK') + ' ' + filePath)
  } else {
    console.log(chalk.red('ERROR') + ' ' + filePath)
  }

  // -c clean up (remove) all nonessential files, except dvi, ps and pdf files.
  // This and the other clean-ups are instead of a regular make.
  process = childProcess.spawnSync('latexmk', ['-cd', '-c', filePath])
}

/**
 * @param {Array} filesOrText - An array of input files, comes from the
 *   commanders’ variadic parameter `[files...]`
 */
function action (files) {
  mediaServer.walk(buildOneFile, {
    path: files,
    regex: 'tex'
  })
}

module.exports = action
