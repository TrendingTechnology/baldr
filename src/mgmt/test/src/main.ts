import path from 'path'

import Mocha from  'mocha'

import config from '@bldr/config'

export function runTests() {
  const mocha = new Mocha();
  config.localRepo
  mocha.addFile(path.join(config.localRepo, 'src/mgmt/test/dist/node/specs/test.js'))
  mocha.run((failures) => {
    process.on('exit', () => {
      process.exit(failures)
    })
  })
}
