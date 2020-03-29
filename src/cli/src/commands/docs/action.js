// Project packages.
const { openWith } = require('@bldr/media-server')

/**
 * Open base path.
 */
function action () {
  openWith('xdg-open', '/var/data/baldr/gh-pages/index.html')
}

module.exports = action
