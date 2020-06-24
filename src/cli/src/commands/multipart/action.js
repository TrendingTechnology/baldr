// Node packages.
const fs = require('fs')

// Third party packages.
const chalk = require('chalk')
const glob = require('glob')

// Project packages.
const coreBrowser = require('@bldr/core-browser')

const lib = require('../../lib.js')
const { normalizeOneFile } = require('../normalize/action.js')

function action (globPattern, prefix, cmdObj) {
  const files = glob.sync(globPattern)
  if (files.length < 1) {
    console.log('Glob matches no files.')
    return
  }
  files.sort()

  let no = 1
  const extension = files[0].split('.').pop()
  const firstNewFileName = `${prefix}.${extension}`
  for (const oldFileName of files) {
    // Omit already existent info file by the renaming.
    if (!oldFileName.match(/yml$/i)) {
      const newFileName = coreBrowser.formatMultiPartAssetFileName(`${prefix}.${extension}`, no)
      console.log(`${chalk.yellow(oldFileName)} -> ${chalk.green(newFileName)}`)
      if (!cmdObj.dryRun) fs.renameSync(oldFileName, newFileName)
      no += 1
    }
  }

  if (fs.existsSync(firstNewFileName) && !cmdObj.dryRun) {
    lib.writeMetaDataYaml(firstNewFileName)
    normalizeOneFile(firstNewFileName, { wikidata: false })
  }
}

module.exports = action
