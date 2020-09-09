// Project packages.
const { CommandRunner } = require('@bldr/cli-utils')

function action (mdbFile) {
  const cmd = new CommandRunner()
  cmd.exec('mdb-export', mdbFile, 'Schüler')
}

module.exports = action
