const { run } = require('@bldr/api')

function action (cmdObj) {
  run(cmdObj.port)
}

module.exports = {
  command: 'api',
  alias: 'a',
  options: [
    ['-p, --port <port>', 'Port to listen to.']
  ],
  description: 'Launch The REST API server.',
  action
}
