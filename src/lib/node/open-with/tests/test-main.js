/* globals describe it */

const assert = require('assert')

const { openInFileManager } = require('../dist/node/main.js')
const { getConfig } = require('@bldr/config')
const { createTmpDir } = require('@bldr/core-node')
const fs = require('fs')
const config = getConfig()

describe('Package “@bldr/open-with”', function () {
  it('config.mediaServer.fileManager', function () {
    assert.strictEqual(config.mediaServer.fileManager, '/usr/bin/nautilus')
  })

  it('Function “openInFileManager()”', function (done) {
    this.timeout(2000)
    const result = openInFileManager(config.mediaServer.basePath)
    assert.strictEqual(result.fileManager, '/usr/bin/nautilus')
    assert.strictEqual(typeof result.filePath, 'string')
    assert.strictEqual(result.opened, true)
    assert.strictEqual(result.createdParentDir, false)
    setTimeout(() => {
      result.process.kill()
      done()
    }, 1000)
  })

  it('Function “openInFileManager(): create dir”', function (done) {
    this.timeout(2000)
    const tmpDir = createTmpDir()
    fs.rmdirSync(tmpDir)
    const result = openInFileManager(tmpDir, true)
    assert.strictEqual(result.fileManager, '/usr/bin/nautilus')
    assert.strictEqual(result.filePath, tmpDir)
    assert.strictEqual(result.createdParentDir, true)
    setTimeout(() => {
      result.process.kill()
      done()
    }, 1000)
  })
})
