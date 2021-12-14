/* globals describe it */
const assert = require('assert')
const path = require('path')

const { readPresentationFile } = require('../dist/node/main.js')
const { getConfig } = require('@bldr/config')
const config = getConfig()

function getAbsPath (relPath) {
  return path.join(config.mediaServer.basePath, relPath)
}

describe('PresentationBuilder', function () {
  it('Asset properties “.relPath”, “.ref”, “.uuid”', async function () {
    const data = readPresentationFile(
      getAbsPath(
        'Musik/09/20_Kontext/20_Romantik/10_Programmmusik/20_Dukas-Zauberlehrling/Praesentation.baldr.yml'
      )
    )
    assert.strictEqual(
      data.relPath,
      'Musik/09/20_Kontext/20_Romantik/10_Programmmusik/20_Dukas-Zauberlehrling/Praesentation.baldr.yml'
    )
  })
})
