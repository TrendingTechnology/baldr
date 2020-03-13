// Node packages.
const fs = require('fs')

// Third party packages.
const glob = require('glob')

// Project packages.
const coreBrowser = require('@bldr/core-browser')

function action (globPattern, prefix) {
  const files = glob.sync(globPattern)
  if (files.length < 1) {
    console.log('Glob matches no files.')
    return
  }
  files.sort()
  console.log(files)
  let no = 1
  const extension = files[0].split('.').pop()
  for (const oldFileName of files) {
    const newFileName = coreBrowser.formatMultiPartAssetFileName(`${prefix}.${extension}`, no)
    console.log(`${oldFileName} -> ${newFileName}`)
    fs.renameSync(oldFileName, newFileName)
    no += 1
  }
}

module.exports = action
