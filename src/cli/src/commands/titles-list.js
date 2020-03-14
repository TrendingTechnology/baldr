// Third party packages.
const chalk = require('chalk')

// Project packages.
const mediaServer = require('@bldr/api-media-server')

const tree = new mediaServer.FolderTitleTree()

function read (filePath) {
  console.log(filePath)
  const titles = new mediaServer.HierarchicalFolderTitles(filePath)
  tree.add(titles)
  console.log(`  id: ${chalk.cyan(titles.id)}`)
  console.log(`  title: ${chalk.yellow(titles.title)}`)
  if (titles.subtitle) console.log(`  subtitle: ${chalk.green(titles.subtitle)}`)
  console.log(`  curriculum: ${chalk.red(titles.curriculum)}`)
  console.log(`  grade: ${chalk.red(titles.grade)}\n`)
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
  console.log(JSON.stringify(tree.tree_, null, 2))
}

module.exports = action
