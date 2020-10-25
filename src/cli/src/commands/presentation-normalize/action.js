// Project packages.
const { operations } = require('@bldr/media-manager')

async function action (filePath) {
  operations.normalizePresentationFile(filePath)
}

module.exports = action
