// Project packages.
const { openWith } = require('@bldr/media-server')

function action () {
  openWith('xdg-open', '/var/data/baldr/gh-pages/index.html')
}

module.exports = action
