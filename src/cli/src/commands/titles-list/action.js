// Third party packages.
const chalk = require('chalk')

// Project packages.
const mediaManager = require('@bldr/media-manager')
const mediaServer = require('@bldr/media-server')

function read (filePath) {
  console.log(filePath)
  const titles = new mediaManager.default.DeepTitle(filePath)
  console.log(`  id: ${chalk.cyan(titles.id)}`)
  console.log(`  title: ${chalk.yellow(titles.title)}`)
  if (titles.subtitle) console.log(`  subtitle: ${chalk.green(titles.subtitle)}`)
  console.log(`  grade: ${chalk.blue(titles.grade)}`)
  console.log(`  curriculum: ${chalk.red(titles.curriculum)}\n`)
}

/**
 *
 * @param {Array} files - An array of input files, comes from the commanders’
 *   variadic parameter `[files...]`.
 */
async function action (files) {
  await mediaServer.walk({
    presentation (relPath) {
      read(relPath)
    }
  }, {
    path: files
  })
}

module.exports = action
