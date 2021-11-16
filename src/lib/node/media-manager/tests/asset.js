/* globals describe it */
const assert = require('assert')
const path = require('path')
const fs = require('fs')

const { operations } = require('../dist/node/operations.js')
const { getConfig } = require('@bldr/config')
const config = getConfig()

function getPath (relPath) {
  return path.join(config.mediaServer.basePath, 'Musik', relPath)
}

describe('Package “@bldr/media-manager”: asset', function () {
  it('Operation “renameByRef()”', function () {
    const testPath = getPath(
      '09/20_Kontext/20_Romantik/10_Programmmusik/35_Ausstellung/10_Ausstellung-Ueberblick/YT/sPg1qlLjUVQ.mp4'
    )
    operations.renameByRef(testPath)
    assert.ok(fs.existsSync(testPath))
  })
})
