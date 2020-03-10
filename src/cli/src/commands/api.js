const { run } = require('@bldr/api')

function action (port) {
  return run(port)
}

module.exports = {
  command: 'api [port]',
  alias: 'a',
  description: 'Launch the REST API server. Specifiy a port to listen to if you what a different one than the default one.',
  action
}
