const log = require('../dist/node/main')

log.setLogLevel(4)

log.info('Some string')

log.info(
  'Test: string (default color) %s string (colored) %s decimal %d float %.1f',
  'troll',
  log.colorize.red('red'),
  123.456,
  123.456,
)
