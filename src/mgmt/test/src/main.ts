import path from 'path'
import fs from 'fs'
import Mocha from 'mocha'

import config from '@bldr/config'

export function runTests (): void {
  const mocha = new Mocha()

  const testSpecsPath = path.join(config.localRepo, 'src/mgmt/test/dist/node/specs')
  fs.readdirSync(testSpecsPath).filter(function (file) {
    return file.substr(-3) === '.js'
  }).forEach(function (file) {
    mocha.addFile(
      path.join(testSpecsPath, file)
    )
  })

  mocha.run((failures) => {
    process.on('exit', () => {
      process.exit(failures)
    })
  })
}
