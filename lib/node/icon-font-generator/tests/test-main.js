/* globals describe it */

const assert = require('assert')
const fs = require('fs')
const path = require('path')

const { createIconFont, setLogLevel } = require('../dist/node/main.js')
const { createTmpDir } = require('@bldr/core-node')
const { getConfig } = require('@bldr/config')

const config = getConfig()
const tmpDir = createTmpDir()
const destDir = createTmpDir()

function assertExists (fileName) {
  assert.ok(fs.existsSync(path.join(destDir, fileName)))
}

describe('Package “@bldr/icon-font-generator”', function () {
  it('Function “createIconFont()”', async function () {
    this.timeout(3600 * 1000)

    config.iconFont.destPath = destDir
    setLogLevel(5)
    await createIconFont(config, tmpDir)

    assertExists('style.css')
    assertExists('icons.json')
    assertExists('baldr-icons.ttf')
    assertExists('baldr-icons.woff')
    assertExists('baldr-icons.woff2')
  })
})
