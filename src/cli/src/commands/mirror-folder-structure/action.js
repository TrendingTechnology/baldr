// Project packages:
const { mirrorFolderStructure } = require('@bldr/media-server')

// Globals.
const { cwd } = require('../../main.js')

function action () {
  console.log(mirrorFolderStructure(cwd))
}

module.exports = action
