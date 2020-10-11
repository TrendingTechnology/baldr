// Project packages.
const { normalizePresentationFile } = require('@bldr/media-manager')

async function action (filePath) {
  normalizePresentationFile(filePath)
}

module.exports = action
