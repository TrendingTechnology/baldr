// Node packages.
const path = require('path')
const fs = require('fs')

// Third party packages.
const chalk = require('chalk')

// Project packages:
const { mirrorFolderStructure } = require('@bldr/api-media-server')

// Globals.
const { cwd } = require('../main.js')

function action () {
  console.log(mirrorFolderStructure(cwd))
}

module.exports = action
